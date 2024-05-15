import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private authService: AuthService) {
    super({
      // 토큰이 유효한지 확인하기 위한 키
      secretOrKey: process.env.JWT_SECRET,
      // 클라이언트에서 오는 토큰이 어디에서 오는지 명시 해 줌
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(tokenInfo: any) {
    console.log('----------- jwt strategy --------------');

    // 신규 회원 추가 정보 입력
    if (tokenInfo.type === 'once') {
      const user = await this.authService.validateUser(tokenInfo.userEmail);
      return { type: 'once', user: user };
    }
  }
}
