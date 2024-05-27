import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-naver';
import { AuthService } from '../auth.service';
import { AuthType } from 'src/enums/auth-type.enum';
import { Injectable } from '@nestjs/common';
import { UserInfo } from 'src/interfaces/user-info.interface';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('NAVER_CLIENT_ID'),
      clientSecret: configService.get<string>('NAVER_CLIENT_SECRET'),
      callbackURL: configService.get<string>('NAVER_CALLBACK_URI'),
    });
  }

  async validate(
    access_token: string,
    refresh_token: string,
    profile: Profile,
    done: any,
  ) {
    const naverAccount = profile._json as any;
    console.log('-------------------- naver validate -----------------------');

    const userInfo: UserInfo = {
      authType: AuthType.Naver,
      authId: naverAccount.id,
      userNick: naverAccount.nickname,
      userName: naverAccount.name || null,
      userEmail: naverAccount.email,
      userPhone: naverAccount.mobile || null,
    }
    // console.log("username : ", naverAccount.name);

    const user = await this.authService.validateUser(naverAccount.email);

    // 기존 회원 -> 로그인
    if (user) {
      const accessToken = await this.authService.createAccessToken(user.userId);
      const refreshToken = await this.authService.createRefreshToken(user.userId);

      done(null, { type: 'login', accessToken, refreshToken, user });

      // 신규 회원 -> 회원가입
    } else {

      if (naverAccount.birthyear && naverAccount.birthday) {
        userInfo.userBirth = await this.authService.parseDate(
          naverAccount.birthyear,
          naverAccount.birthday,
        );
      }

      let imgUrl = null;
      if (naverAccount.profile_image) {
        // TODO 이미지 객체 생성
        // imgUrl = naverAccount.profile_image;
      }

      const user = await this.authService.saveAuthUser(userInfo, imgUrl);
      const onceToken = await this.authService.createOnceToken(user.userId);
      done(null, { type: 'once', onceToken, user });
    }
  }
}
