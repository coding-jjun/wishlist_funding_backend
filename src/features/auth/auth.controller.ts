import {
  Controller,
  Get,
  Body,
  Patch,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { KakaoAuthGuard } from './guard/kakao-auth-guard';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guard/jwt-auth-guard';
import { AuthUserDto } from './auth-user.dto';
import { NaverAuthGuard } from './guard/naver-auth-guard';
import { GoogleAuthGuard } from './guard/google-auth-guard';
import { JwtRefreshGuard } from './guard/jwt-refresh-guard';
import { CommonResponse } from 'src/interfaces/common-response.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  async kakaoLogin() {
    return;
  }

  @Get('kakao/callback')
  @UseGuards(KakaoAuthGuard)
  async kakaoCallback(@Req() req: Request, @Res() res: Response) {
    return await this.setupAuthResponse(res, req.user);
  }

  @Get('naver')
  @UseGuards(NaverAuthGuard)
  async naverLogin() {
    return;
  }

  @Get('naver/callback')
  @UseGuards(NaverAuthGuard)
  async naverCallback(@Req() req: Request, @Res() res:Response){
    return await this.setupAuthResponse(res, req.user);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin(){
    return;
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req: Request, @Res() res:Response){
    return await this.setupAuthResponse(res, req.user);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async signup(
    @Req() req: any,
    @Res() res: Response,
    @Body() authUserDto: AuthUserDto,
  ) {
    req.user.user = await this.authService.saveAuthUser(authUserDto, req.user.user);
    return await this.setupAuthResponse(res, req.user);
  }

  async setupAuthResponse(res: Response, userInfo: any){
    switch(userInfo.type){
      case 'login':
        res.clearCookie('once');
        res.cookie('access_token', userInfo.accessToken);
        res.cookie('refresh_token', userInfo.refreshToken);
        break

      case 'once' :
        res.cookie('once', userInfo.onceToken);
        break
    }
    res.json({user: userInfo.user, needReissue: userInfo.needReissue});
    return res;
  }

  @Get('/token')
  @UseGuards(JwtRefreshGuard)
  async reIssueAccessToken(): Promise<CommonResponse>{
    return {
      message: 'Access Token 재발급 완료',
      data: true
    }; 
  }
  
}
