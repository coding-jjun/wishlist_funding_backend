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
    req.user.user = await this.authService.saveAuthUser(authUserDto, req.user);
    return await this.setupAuthResponse(res, req.user);
  }

  async setupAuthResponse(res: Response, userInfo: any) {
    if (userInfo.type === 'login') {
      res.cookie('access_token', userInfo.accessToken);
      res.cookie('refresh_token', userInfo.refreshToken);
      res.json({ user: userInfo.user });
    } else if (userInfo.type === 'once') {
      res.cookie('once', userInfo.onceToken);
      res.json({ user: userInfo.user });
    }
    return res;
  }
}
