import { Module } from '@nestjs/common';
import { DepositController } from './deposit.controller';
import { DepositService } from './deposit.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UploadDepositUseCase } from './application/usecases/upload-deposit.usecase';
import { MatchDepositUseCase } from './application/usecases/match-deposit.usecase';
import { InMemoryDepositRepository } from './infrastructure/repositories/in-memory-deposit.repository';
import { InMemoryProvisionalDonationRepository } from './infrastructure/repositories/in-memory-provisional-donation.repository';
import { GiftogetherExceptions } from '../../filters/giftogether-exception';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [DepositController],
  providers: [
    DepositService,
    UploadDepositUseCase,
    MatchDepositUseCase,
    InMemoryDepositRepository,
    InMemoryProvisionalDonationRepository,
    GiftogetherExceptions,
  ],
})
export class DepositModule {}
