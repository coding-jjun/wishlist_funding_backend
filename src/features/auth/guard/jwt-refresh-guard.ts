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
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    if(!request.cookies['refresh_token']){
      throw this.jwtException.TokenMissing;
    }

    const refreshToken = request.cookies['refresh_token'];

    const tokenInfo = await this.authService.verifyRefreshToken(refreshToken);
    const userId = tokenInfo.userId;
    
    const isInBlackList = await this.authService.isBlackListToken(userId, refreshToken);
    if(isInBlackList){
      throw this.jwtException.NotValidToken;
    }
    
    const isValid = await this.authService.validateRefresh(userId, refreshToken);
    if(!isValid){
      throw this.jwtException.NotValidToken;
    }
    const reIssueToken = await this.authService.createAccessToken(userId);
    response.cookie('access_token', reIssueToken);
    return true;

  }

}