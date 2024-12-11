import { Module } from '@nestjs/common';
import { DepositController } from './deposit.controller';
import { DepositService } from './deposit.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UploadDepositUseCase } from './application/usecases/upload-deposit.usecase';
import { MatchDepositUseCase } from './application/usecases/match-deposit.usecase';
import { InMemoryDepositRepository } from './infrastructure/repositories/in-memory-deposit.repository';
import { InMemoryProvisionalDonationRepository } from './infrastructure/repositories/in-memory-provisional-donation.repository';
import { GiftogetherExceptions } from '../../filters/giftogether-exception';
import { DepositEventHandler } from './domain/events/deposit-event.handler';
import { InMemoryDonationRepository } from '../donation/infrastructure/repositories/in-memory-donation.repository';
import { FundingRepository } from '../funding/infrastructure/repositories/funding.repository';
import { NotificationService } from '../notification/notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Funding } from 'src/entities/funding.entity';
import { Notification } from 'src/entities/notification.entity';
import { User } from 'src/entities/user.entity';
import { Donation } from 'src/entities/donation.entity';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    TypeOrmModule.forFeature([Funding, Notification, User, Donation]),
  ],
  controllers: [DepositController],
  providers: [
    DepositService,
    UploadDepositUseCase,
    MatchDepositUseCase,
    InMemoryDepositRepository,
    InMemoryProvisionalDonationRepository,
    GiftogetherExceptions,
    DepositEventHandler,
    InMemoryDonationRepository,
    FundingRepository,
    NotificationService,
  ],
})
export class DepositModule {}
