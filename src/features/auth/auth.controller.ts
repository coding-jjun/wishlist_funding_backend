import {
  Controller,
  Get,
  Body,
  Patch,
  Req,
  Res,
  UseGuards,
  Post,
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
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from '../user/dto/user.dto';

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
    req.user = await this.authService.saveUser(req.user, authUserDto);
    res.json({user: req.user});
    return res;
  }

  @Post(`/signup`)
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Res() res
  ): Promise<CommonResponse> {
    const userDto = await this.authService.createUser(createUserDto);
    await this.setupAuthResponse(res, userDto.userId);
    const response: CommonResponse = {
      message: '회원가입 완료',
      data: userDto,
    };
    return res.status(200).json(response);
  }


  /**
   * 토큰을 발급받고 cookie 에 설정 후 사용자에게 응답한다.
   */
  async setupAuthResponse(res: Response, userId: number): Promise<void> {
    const accessToken = await this.authService.createAccessToken(userId);
    const refreshToken = await this.authService.createRefreshToken(userId);
    res.cookie('access_token', await this.authService.createAccessToken(userId));
    res.cookie('refresh_token', await this.authService.createRefreshToken(userId));
  }

  @Get('/token')
  @UseGuards(JwtRefreshGuard)
  async reIssueAccessToken(): Promise<CommonResponse>{
    return {
      message: 'Access Token 재발급 완료',
      data: true
    }; 
  }
  
  @Get('/logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: any): Promise<CommonResponse>{
    const accessToken = req.headers['authorization'].split(' ')[1];
    const refreshToken = req.cookies['refresh_token'];
    await this.authService.logout(req.user.userId, accessToken, refreshToken);
    return {
      message: '로그아웃 성공',
      data: true
    }
  }


}
