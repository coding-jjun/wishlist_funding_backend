import { TypeOrmModule } from '@nestjs/typeorm';
import { Funding } from '@entities/funding.entity';
import { Gift } from '@entities/gift.entity';
import { GiftController } from './gift.controller';
import { GiftService } from './gift.service';
import { Module } from '@nestjs/common';
import { FundingService } from '../funding/funding.service';
import { User } from '@entities/user.entity';
import { Friend } from '@entities/friend.entity';
import { GiftogetherExceptions } from '@filters/giftogether-exception';

@Module({
  imports: [TypeOrmModule.forFeature([Gift, Funding])],
  controllers: [GiftController],
  providers: [GiftService, GiftogetherExceptions],
  exports: [GiftService],
})
export class GiftModule {}
