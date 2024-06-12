import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RedisClientType } from '@redis/client';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwtException: GiftogetherExceptions,
    @Inject('REDIS_CLIENT')
    private readonly redisClient: RedisClientType,
    private readonly authService: AuthService,
  ) {
    super('jwt');
  }

  /**
   * 요청 보호, 검증 위임, 유효한 토큰에 대한 요청 처리(/차단)
   * @param context 
   * @returns 
   */

  async canActivate(context: ExecutionContext): Promise<boolean> {

    // 헤더에 토큰 존재 유무 확인
    const { authorization } = context.switchToHttp().getRequest().headers;
    if (!authorization) {
      throw this.jwtException.TokenMissing;
    }
    const accessToken = authorization.split(' ')[1];

    const tokenInfo = await this.authService.verifyAccessToken(accessToken);

    const isInBlackList = await this.authService.isBlackListToken(tokenInfo.userId, accessToken);
    if(isInBlackList){
      throw this.jwtException.NotValidToken;
    }

    try {
      await super.canActivate(context);
      return true;

    } catch (error) {
      throw this.jwtException.NotValidToken;
    }
  }
}
