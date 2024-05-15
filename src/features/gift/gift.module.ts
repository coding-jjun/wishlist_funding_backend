import { TypeOrmModule } from '@nestjs/typeorm';
import { Funding } from 'src/entities/funding.entity';
import { Gift } from 'src/entities/gift.entity';
import { GiftController } from './gift.controller';
import { GiftService } from './gift.service';
import { Module } from '@nestjs/common';
import { FundingService } from '../funding/funding.service';
import { User } from 'src/entities/user.entity';
import { Friend } from 'src/entities/friend.entity';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';

@Module({
  imports: [TypeOrmModule.forFeature([Gift, Funding])],
  controllers: [GiftController],
  providers: [GiftService, GiftogetherExceptions],
  exports: [GiftService],
})
export class GiftModule {}
