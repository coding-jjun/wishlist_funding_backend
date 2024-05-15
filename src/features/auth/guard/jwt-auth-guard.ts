import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
  ) {
    super('jwt');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('----------- jwt guard --------------');
    const request = context.switchToHttp().getRequest();
    
    // 헤더에 토큰이 있는지 확인
    const { authorization } = request.headers;
    if (!authorization) {
      // TODO header 에 토큰 없을 때, 예외처리하기
      return false;
    }

    // TODO 토큰 재발급 관리 & 유효시간

    try {
      const res = await super.canActivate(context);
      console.log('JwtStrategy validation result:', res);
      return true;

    } catch (error) {
      console.log('Error during JWT validation:', error);
      return false;
    }
  }
}