import {
  Controller,
  Get,
  Body,
  Post,
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
  async naverCallback(@Req() req: Request, @Res() res: Response) {
    return await this.setupAuthResponse(res, req.user);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async signup(
    @Req() req: any,
    @Res() res: Response,
    @Body() authUserDto: AuthUserDto,
  ) {
    const userInfo = req.user;

    if (userInfo.type === 'once') {
      console.log('updateUser : ', userInfo);
      const user = await this.authService.saveAuthUser(
        authUserDto,
        userInfo.user,
      );
      res.json({ user: user });
    }
    res.end();
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
