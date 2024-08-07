import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';
import { AuthService } from '../auth.service';
import { AuthType } from 'src/enums/auth-type.enum';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { CreateUserDto } from '../dto/create-user.dto';
import { TokenDto } from '../dto/token.dto';
import { DefaultImageId } from 'src/enums/default-image-id';

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

    const createUserDto = new CreateUserDto();

    createUserDto.authType = AuthType.Kakao;
    createUserDto.authId = resProfile.id;
    createUserDto.userEmail = kakaoAccount.email;
    createUserDto.userName = kakaoAccount.name;

    // user == 로그인
    let user = await this.authService.validateUser(kakaoAccount.email, AuthType.Kakao);
    
    let type = null;

    // ! user == 회원 가입
    if(! user){
      // 닉네임 유효성 검증
      const isValidNick = await this.authService.validUserInfo("userNick", kakaoAccount.profile.nickname);
      if(isValidNick){
        createUserDto.userNick = kakaoAccount.profile.nickname;
      }else{
        // TODO 기본 닉네임 생성
      }
    
      // 핸드폰 번호 유효성 검증
      if(kakaoAccount.phone_number){
        
        const isValidPhone = await this.authService.validUserInfo("userPhone", kakaoAccount.phone_number);
        if(! isValidPhone){
          throw this.g2gException.UserAlreadyExists;
        }
        createUserDto.userPhone = kakaoAccount.phone_number;
      }

      if (kakaoAccount.has_birthyear && kakaoAccount.has_birthday) {
        createUserDto.userBirth = await this.authService.parseDate(
          kakaoAccount.birthyear,
          kakaoAccount.birthday,
        );
      }
      createUserDto.userImg = kakaoAccount.profile.thumbnail_image_url;

      user = await this.authService.createUser(createUserDto);
      type = "signup"
    }else{
      type = "login"
    }
    const tokenDto = new TokenDto();
    tokenDto.accessToken = await this.authService.createAccessToken(user.userId);
    tokenDto.refreshToken = await this.authService.createRefreshToken(user.userId);
    done(null, {user, tokenDto, type});
  }
}
