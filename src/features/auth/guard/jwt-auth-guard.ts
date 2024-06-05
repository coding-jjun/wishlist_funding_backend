import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwtException: GiftogetherExceptions,
  ) {
    super('jwt');
  }

  /**
   * 요청 보호, 검증 위임, 유효한 토큰에 대한 요청 처리(/차단)
   * @param context 
   * @returns 
   */

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('----------- jwt guard --------------');
    const request = context.switchToHttp().getRequest();

    // 헤더에 토큰 존재 유무 확인
    const { authorization } = request.headers;
    if (!authorization) {
      throw this.jwtException.TokenMissing;
    }
    
    try {
      await super.canActivate(context);
      return true;

    } catch (error) {
      throw this.jwtException.NotValidToken;
    }
  }
}
