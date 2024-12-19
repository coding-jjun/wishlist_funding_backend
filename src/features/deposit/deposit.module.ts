import { Module } from '@nestjs/common';
import { DepositController } from './deposit.controller';
import { DepositService } from './deposit.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UploadDepositUseCase } from './commands/upload-deposit.usecase';
import { MatchDepositUseCase } from './commands/match-deposit.usecase';
import { InMemoryDepositRepository } from './infrastructure/repositories/in-memory-deposit.repository';
import { InMemoryProvisionalDonationRepository } from './infrastructure/repositories/in-memory-provisional-donation.repository';
import { GiftogetherExceptions } from '../../filters/giftogether-exception';
import { DepositEventHandler } from './domain/events/deposit-event.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Funding } from 'src/entities/funding.entity';
import { Notification } from 'src/entities/notification.entity';
import { User } from 'src/entities/user.entity';
import { Donation } from 'src/entities/donation.entity';
import { Deposit } from './domain/entities/deposit.entity';
import { ProvisionalDonation } from './domain/entities/provisional-donation.entity';
import { FindProvDonationsBySenderSigUseCase } from './queries/find-provisional-donations-by-sender-sig.usecase';
import { CreateDonationUseCase } from '../donation/commands/create-donation.usecase';
import { IncreaseFundSumUseCase } from '../funding/commands/increase-fundsum.usecase';
import { NotificationService } from '../notification/notification.service';
import { DecreaseFundSumUseCase } from '../funding/commands/decrease-fundsum.usecase';
import { FindAllAdminsUseCase } from '../admin/queries/find-all-admins.usecase';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    TypeOrmModule.forFeature([
      Funding,
      Notification,
      User,
      Donation,
      Deposit,
      ProvisionalDonation,
    ]),
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
    FindProvDonationsBySenderSigUseCase,
    CreateDonationUseCase,
    IncreaseFundSumUseCase,
    DecreaseFundSumUseCase,
    NotificationService,
    FindAllAdminsUseCase,
  ],
})
export class DepositModule {}
