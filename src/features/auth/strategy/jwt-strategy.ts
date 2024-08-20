import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
  async validate(tokenInfo: any, done: any) {
    // 사용자 인증/인가
    const userId = tokenInfo.userId;
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['account']
    });
    if(!user){
      throw this.jwtException.UserNotFound;
    }
    done(null, user)
  }
}

