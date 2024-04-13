import { Module } from '@nestjs/common';
import { DonationController } from './donation.controller';
import { DonationService } from './donation.service';
import { RollingPaperService } from '../rolling-paper/rolling-paper.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donation } from 'src/entities/donation.entity';
import { RollingPaper } from 'src/entities/rolling-paper.entity';
import { Funding } from 'src/entities/funding.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Donation, RollingPaper, Funding, User])],
  controllers: [DonationController],
  providers: [DonationService, RollingPaperService],
})
export class DonationModule {}
