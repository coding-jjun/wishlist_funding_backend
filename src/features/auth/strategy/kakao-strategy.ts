import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';
import { AuthService } from '../auth.service';
import { AuthType } from 'src/enums/auth-type.enum';
import { UserInfo } from 'src/interfaces/user-info.interface';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly g2gException: GiftogetherExceptions,
  ) {
    super({
      clientID: configService.get<string>('KAKAO_CLIENT_ID'),
      clientSecret: configService.get<string>('KAKAO_CLIENT_SECRET'),
      callbackURL: configService.get<string>('KAKAO_CALLBACK_URI'),
    });
  }
  async validate(
    access_token: string,
    refresh_token: string,
    profile: Profile,
    done: any,
  ) {
    const resProfile = profile._json;
    const kakaoAccount = resProfile.kakao_account;

    const userInfo: UserInfo = {
      authType: AuthType.Kakao,
      authId: resProfile.id,
      userName: kakaoAccount.name || null,
      userEmail: kakaoAccount.email,
    }

    // user == 로그인
    let user = await this.authService.validateUser(kakaoAccount.email, AuthType.Kakao);

    // ! user == 회원 가입
    if(! user){

      // 닉네임 유효성 검증
      const isValidNick = await this.authService.validUserInfo("userNick", kakaoAccount.profile.nickname);
      if(isValidNick){
        userInfo.userNick = kakaoAccount.profile.nickname;
      }
    
      // 핸드폰 번호 유효성 검증
      if(kakaoAccount.phone_number){
        
        const isValidPhone = await this.authService.validUserInfo("userPhone", kakaoAccount.phone_number);
        if(! isValidPhone){
          throw this.g2gException.UserAlreadyExists;
        }
        userInfo.userPhone = kakaoAccount.phone_number;
      }
        
      if (kakaoAccount.has_birthyear && kakaoAccount.has_birthday) {
        userInfo.userBirth = await this.authService.parseDate(
          kakaoAccount.birthyear,
          kakaoAccount.birthday,
        );
      }

      let imgUrl = null;
      if (kakaoAccount.profile.is_default_image) {
        imgUrl = kakaoAccount.profile.thumbnail_image_url;
      }
      user = await this.authService.saveAuthUser(userInfo, imgUrl);
    }
    done(null, user);
  }
}
