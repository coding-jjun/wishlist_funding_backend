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

    const userInfo: UserInfo = {
      authType: AuthType.Naver,
      authId: naverAccount.id,
      userName: naverAccount.name || null,
      userEmail: naverAccount.email,
      userPhone: naverAccount.mobile || null,
    }

    // user == 로그인
    let user = await this.authService.validateUser(naverAccount.email, AuthType.Naver);

    // ! user == 회원 가입
    if (! user) {
      if (naverAccount.birthyear && naverAccount.birthday) {
        userInfo.userBirth = await this.authService.parseDate(
          naverAccount.birthyear,
          naverAccount.birthday,
        );
      }

      let imgUrl = null;
      if (naverAccount.profile_image) {
        imgUrl = naverAccount.profile_image;
      }
      user = await this.authService.saveAuthUser(userInfo, imgUrl);
    }
    done(null, user);
    
  }
}
