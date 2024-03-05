import { Module } from '@nestjs/common';
import { FundingController } from './funding.controller';
import { FundingService } from './funding.service';

@Module({
  controllers: [FundingController],
  providers: [FundingService]
})
export class FundingModule {}
