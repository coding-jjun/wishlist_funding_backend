import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GiftogetherExceptions } from "src/filters/giftogether-exception";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt'){
  constructor(
    private authService: AuthService,
    private readonly jwtException: GiftogetherExceptions,
  ) {
    super('jwt');
  }

  /**
   * token 재발급 
   * @param context 
   * @returns 
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('----------- jwt guard --------------');
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    if(!request.cookies['refresh_token']){
      throw this.jwtException.TokenMissing;
    }

    // Refresh token 유효 검사
    const refreshToken = request.cookies['refresh_token'];
    const refreshInfo = await this.authService.verifyRefreshToken(refreshToken);

    const isValid = await this.authService.validateRefreshToken(refreshToken, refreshInfo);

    if(!isValid){
      throw this.jwtException.NotValidToken;
    }

    const reIssueToken = await this.authService.createAccessToken(refreshInfo.userId);
    
    response.cookie('access_token', reIssueToken);
    return true;

  }

}