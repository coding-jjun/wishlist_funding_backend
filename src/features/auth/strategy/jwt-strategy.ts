import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private authService: AuthService,
    private readonly jwtException: GiftogetherExceptions,
  ) {
    super({
      // 토큰이 유효한지 확인하기 위한 키
      secretOrKey: process.env.JWT_SECRET,
      // 클라이언트에서 오는 토큰이 어디에서 오는지 명시 해 줌
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  /**
   * 토큰 유효성 검사
   * @param tokenInfo : passport 에서 자동으로 secretKey를 이용해 token 을 decode 한다.
   * @param done 
   */
  async validate(tokenInfo: any, done:any) {
    console.log('----------- jwt strategy --------------');

    // 회원 가입 : 회원 가입시 추가 정보 입력 (토큰 발급)
    if(tokenInfo.type === 'once'){
      const user = await this.authService.getUser(tokenInfo.userId);
      const accessToken = await this.authService.createAccessToken(user.userId);
      const refreshToken = await this.authService.createRefreshToken(user.userId);

      done(null, {type: 'login', accessToken, refreshToken, user})
    }

    done(null, true)
  }
  }
}
