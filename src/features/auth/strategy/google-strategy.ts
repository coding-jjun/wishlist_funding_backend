import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { AuthService } from "../auth.service";
import { AuthType } from "src/enums/auth-type.enum";
import { UserInfo } from "src/interfaces/user-info.interface";


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google'){
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ){
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URI'),
      scope: ['profile', 'email']
      // scope += 'https://www.googleapis.com/auth/user.phonenumbers.read', 'https://www.googleapis.com/auth/user.birthday.read', 'https://www.googleapis.com/auth/user.addresses.read'
    });
  }
  async validate(access_token: string, refresh_token: string, profile: Profile, done:any) {

    const googleAccount = profile._json;
    if(!googleAccount.email_verified){
      // TODO 구글 이메일 에러
      done(null, false);
    }
    const userEmail = googleAccount.email;
    console.log("let's make userInfo");
    const userInfo : UserInfo = {
      authType: AuthType.Google,
      authId: googleAccount.sub,
      userNick: googleAccount.name,
      userEmail: userEmail,
    }

    const user = await this.authService.validateUser(userEmail);

    // 기존 회원 -> 로그인
    if(user){

      const accessToken = await this.authService.createAccessToken(userEmail);
      const refreshToken = await this.authService.createRefreshToken(userEmail);

      done(null, {type: 'login', accessToken, refreshToken, user})
      
    // 신규 회원 -> 회원가입
    }else{
      const onceToken = await this.authService.onceToken(userEmail);

      let imgUrl = null;
      if(googleAccount.picture){
        // imgUrl = googleAccount.picture;
      }

      const user = await this.authService.saveAuthUser(userInfo, imgUrl);
      done(null, {type: 'once', onceToken, user})
    }
  }
}



