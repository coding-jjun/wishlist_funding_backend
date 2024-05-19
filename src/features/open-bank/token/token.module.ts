import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { OpenBankApiClient } from '../open-bank-api-client';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpenBankToken } from 'src/entities/open-bank-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OpenBankToken])],
  controllers: [TokenController],
  providers: [TokenService, OpenBankApiClient],
})
export class TokenModule {}
