import { Injectable } from '@nestjs/common';
import { TokenRequestDataDto } from '../dto/token-request-data.dto';
import { OpenBankApiClient } from '../open-bank-api-client';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OpenBankToken } from 'src/entities/open-bank-token.entity';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(OpenBankToken)
    private readonly openBankTokenRepo: Repository<OpenBankToken>,
    private openBankApiClient: OpenBankApiClient,
  ) {}

  async saveOpenBankToken(tokenReqData: TokenRequestDataDto) {
    // TODO 회원찾기

    // code 로 Token 요청 보내기
    const tokenRes = await this.openBankApiClient.requestOpenBankToken(
      tokenReqData.code,
    );

    const token = new OpenBankToken();
    token.accessToken = tokenRes.access_token;
    token.refreshToken = tokenRes.refreshToken;
    token.expiresIn = tokenRes.expires_in;
    token.userSeq = parseInt(tokenRes.user_seq_no);

    return await this.openBankTokenRepo.save(token);
    // TODO userSeq(사용자일련번호)가 없을 경우
  }
}
