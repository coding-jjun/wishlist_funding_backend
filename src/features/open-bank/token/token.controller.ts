import { Body, Controller, Post } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenRequestDataDto } from '../dto/token-request-data.dto';
import { CommonResponse } from 'src/interfaces/common-response.interface';

@Controller('api/token')
export class TokenController {
  constructor(private tokenService: TokenService) {}

  @Post()
  async saveOpenBankToken(
    @Body() reqOpenBankToken: TokenRequestDataDto,
  ): Promise<CommonResponse> {
    const token = this.tokenService.saveOpenBankToken(reqOpenBankToken);
    return {
      message: '성공적으로 생성했습니다.',
      data: token,
    };
  }
}
