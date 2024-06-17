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
import { NaverAuthGuard } from './guard/naver-auth-guard';
import { GoogleAuthGuard } from './guard/google-auth-guard';
import { JwtRefreshGuard } from './guard/jwt-refresh-guard';
import { CommonResponse } from 'src/interfaces/common-response.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from '../user/dto/user.dto';
import { LoginDto } from './dto/login.dto';
import { ValidDto } from './dto/valid.dto';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly g2gException: GiftogetherExceptions,
  ) {}

  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  async kakaoLogin() {
    return;
  }

  @Get('kakao/callback')
  @UseGuards(KakaoAuthGuard)
  async kakaoCallback(@Req() req: Request, @Res() res: Response){
    try {
      const userDto = req.user as UserDto;
      const accessToken = await this.authService.createAccessToken(userDto.userId);
      const refreshToken = await this.authService.createRefreshToken(userDto.userId);
      res.cookie('access_token', accessToken);
      res.cookie('refresh_token', refreshToken);
      
      const response: CommonResponse = {
          message: '카카오 가입 완료',
          data: userDto,
      };
      return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: "서버 오류" });
    }
  }

  @Get('naver')
  @UseGuards(NaverAuthGuard)
  async naverLogin() {
    return;
  }

  @Get('naver/callback')
  @UseGuards(NaverAuthGuard)
  async naverCallback(@Req() req: Request, @Res() res:Response){
    try {
      const userDto = req.user as UserDto;
      const accessToken = await this.authService.createAccessToken(userDto.userId);
      const refreshToken = await this.authService.createRefreshToken(userDto.userId);
      res.cookie('access_token', accessToken);
      res.cookie('refresh_token', refreshToken);
      
      const response: CommonResponse = {
          message: '네이버 가입 완료',
          data: userDto,
      };
      return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: "서버 오류" });
    }
  }
  

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin(){
    return;
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req: Request, @Res() res:Response){
    try {
      const userDto = req.user as UserDto;
      const accessToken = await this.authService.createAccessToken(userDto.userId);
      const refreshToken = await this.authService.createRefreshToken(userDto.userId);
      res.cookie('access_token', accessToken);
      res.cookie('refresh_token', refreshToken);
      
      const response: CommonResponse = {
          message: '구글 가입 완료',
          data: userDto,
      };
      return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: "서버 오류" });
    }
    
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res:Response){
    try {
      const userDto = await this.authService.login(loginDto);
      const accessToken = await this.authService.createAccessToken(userDto.userId);
      const refreshToken = await this.authService.createRefreshToken(userDto.userId);
      res.cookie('access_token', accessToken);
      res.cookie('refresh_token', refreshToken);
      
      const response: CommonResponse = {
          message: '로그인 완료',
          data: userDto,
      };
      return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: "서버 오류" });
    }
  }
  

  @Patch('/signup/extra')
  @UseGuards(JwtAuthGuard)
  async extraSignup(
    @Req() req: any,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<CommonResponse> {
    return {
      message: '추가 회원가입 완료',
      data: await this.authService.updateUser(req.user, updateUserDto)
    }; 
  }

  @Post(`/signup`)
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Res() res
  ): Promise<CommonResponse> {
    try {
      const userDto = await this.authService.createUser(createUserDto);
      const accessToken = await this.authService.createAccessToken(userDto.userId);
      const refreshToken = await this.authService.createRefreshToken(userDto.userId);
      res.cookie('access_token', accessToken);
      res.cookie('refresh_token', refreshToken);
      
      const response: CommonResponse = {
          message: '회원가입 완료',
          data: userDto,
      };
      return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: "서버 오류" });
    }
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

  @Post('/email')
  async validUserEmail(@Body() validDto: ValidDto): Promise<CommonResponse>{
    
    if(!validDto.userEmail){
      throw this.g2gException.NotValidEmail;
    }

    const isValid = await this.authService.validUserInfo("userEmail", validDto.userEmail);
    if(!isValid){
      throw this.g2gException.NotValidEmail;
    }
    return {
      message: '유효한 이메일 입니다.',
      data: true
    };
  }

  @Post('/phone')
  async validUserPhone(@Body() validDto: ValidDto): Promise<CommonResponse>{

    if(!validDto.userPhone){
      throw this.g2gException.NotValidPhone;
    }

    const isValid = await this.authService.validUserInfo("userPhone", validDto.userPhone);
    if(!isValid){
      throw this.g2gException.NotValidPhone;
    }
    return {
      message: '유효한 번호 입니다.',
      data: true
    }; 
  }

  @Post('/nickname')
  async validNickName(@Body() validDto: ValidDto): Promise<CommonResponse>{

    if(!validDto.userNick){
      throw this.g2gException.NotValidNick;
    }

    const isValid = await this.authService.validUserInfo("userNick", validDto.userNick);
    if(!isValid){
      throw this.g2gException.NotValidNick;
    }
    return {
      message: '유효한 닉네임 입니다.',
      data: true
    }; 
  }

}
