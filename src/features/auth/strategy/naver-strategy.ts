import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-naver';
import { AuthService } from '../auth.service';
import { AuthType } from 'src/enums/auth-type.enum';
import { Injectable } from '@nestjs/common';
import { UserInfo } from 'src/interfaces/user-info.interface';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly g2gException: GiftogetherExceptions,
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
    }

    // user == 로그인
    let user = await this.authService.validateUser(naverAccount.email, AuthType.Naver);


    // ! user == 회원 가입
    if (! user) {

      // 닉네임 유효성 검증
      const isValidNick = await this.authService.validUserInfo("userNick",naverAccount.nickName);
      if(isValidNick){
        userInfo.userNick = naverAccount.nickName;
      }

      // 핸드폰 번호 유효성 검증
      if(naverAccount.mobile){
        console.log("naverAccount.mobile : ", naverAccount.mobile)
        
        const isValidPhone = await this.authService.validUserInfo("userPhone", naverAccount.mobile);
        if(! isValidPhone){
          throw this.g2gException.UserAlreadyExists;
        }
        userInfo.userPhone = naverAccount.mobile;
      }

      if (naverAccount.profile_image) {
        userInfo.userImg = naverAccount.profile_image;
      }
      user = await this.authService.createUser(userInfo);
    }
    done(null, user);
    
  }
}
