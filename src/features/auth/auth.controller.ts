import { Controller, Get, HttpException, HttpStatus, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CommonResponse } from 'src/interfaces/common-response.interface';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService){}

  @Get('/oauth')
  async requestKakaoToken(@Query('code') code: string): Promise<CommonResponse> {
    console.log("code for token : ", code);
    try {
      return {
        message: 'success',
        data : await this.authService.requestKakaoToken(code)
      };
    } catch (error) {
      throw new HttpException(
        'Failed to get user info',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
