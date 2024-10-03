import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RedisClientType } from '@redis/client';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { AuthService } from '../auth.service';
import { UserType } from 'src/enums/user-type.enum';

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
    const request = context.switchToHttp().getRequest();
    const cookies = request.cookies;
    const accessToken = cookies['access_token'];

    if (!accessToken) {
      throw this.jwtException.TokenMissing;
    }
    
    try {
      const tokenInfo = await this.authService.verifyAccessToken(accessToken);

      // 비회원이 정회원 API 요청한 경우
      if(UserType.GUEST === tokenInfo.type && request.url !== '/donation/guest') {
        throw this.jwtException.InvalidUserType;

      }
      const isInBlackList = await this.authService.isBlackListToken(tokenInfo.userId, accessToken);
      if (isInBlackList) {
        throw this.jwtException.NotValidToken;
      }

      return super.canActivate(context) as Promise<boolean>;
    } catch (error) {
      throw this.jwtException.NotValidToken;
    }
  }
}
