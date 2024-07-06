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
import { CommonResponse } from 'src/interfaces/common-response.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from '../user/dto/user.dto';
import { LoginDto } from './dto/login.dto';
import { ValidDto } from './dto/valid.dto';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { TokenDto } from './dto/token.dto';

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
  async kakaoCallback(@Req() req: Request){
    const user = req.user as { user: UserDto, tokenDto: TokenDto };  
    return {
      message: '카카오 가입 완료',
      data: [
        { "user": user[0] },
        { "token": user[1] },
      ],
    };
  }

  @Get('naver')
  @UseGuards(NaverAuthGuard)
  async naverLogin() {
    return;
  }

  @Get('naver/callback')
  @UseGuards(NaverAuthGuard)
  async naverCallback(@Req() req: Request){
    const user = req.user as { user: UserDto, tokenDto: TokenDto };  
    return {
      message: '네이버 가입 완료',
      data: [
        { "user": user[0] },
        { "token": user[1] },
      ],
    };
  }
  

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin(){
    return;
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req: Request){
    const user = req.user as { user: UserDto, tokenDto: TokenDto };  
    return {
      message: '구글 가입 완료',
      data: [
        { "user": user[0] },
        { "token": user[1] },
      ],
    };   
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto){
    const userDto = await this.authService.login(loginDto);
    const token = new TokenDto()
    token.accessToken = await this.authService.createAccessToken(userDto.userId);
    token.refreshToken = await this.authService.createRefreshToken(userDto.userId);
    
    return {
      message: '로그인 완료',
      data: [
        { "user": userDto },
        { "token": token },
      ],
    };  
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
  ): Promise<CommonResponse> {
    const userDto = await this.authService.createUser(createUserDto);
    const token = new TokenDto();
    token.accessToken = await this.authService.createAccessToken(userDto.userId);
    token.refreshToken = await this.authService.createRefreshToken(userDto.userId);
    return {
      message: '회원가입 완료',
      data: [
        { "user": userDto },
        { "token": token },
      ],
    };  
  }

  @Get('/token')
  async reIssueAccessToken(@Body() tokenDto: TokenDto): Promise<CommonResponse>{
    this.authService.chkValidRefreshToken(tokenDto.userId, tokenDto.refreshToken);
    return {
      message: 'Access Token 재발급 완료',
      data: await this.authService.createAccessToken(tokenDto.userId)
    }; 
  }
  
  @Post('/logout')
  async logout(@Body() tokenDto: TokenDto): Promise<CommonResponse>{
    await this.authService.logout(tokenDto.userId, tokenDto.refreshToken);
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
