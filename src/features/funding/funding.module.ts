import { Module } from '@nestjs/common';
import { FundingController } from './funding.controller';
import { FundingService } from './funding.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Funding } from 'src/entities/funding.entity';
import { User } from 'src/entities/user.entity';
import { Comment } from 'src/entities/comment.entity';
import { Friend } from 'src/entities/friend.entity';
import { GiftService } from '../gift/gift.service';
import { Gift } from 'src/entities/gift.entity';
import { Image } from 'src/entities/image.entity';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';

@Module({
  imports: [TypeOrmModule.forFeature([Funding, User, Comment, Friend, Gift, Image])],
  controllers: [FundingController],
  providers: [FundingService, GiftService, GiftogetherExceptions],
  exports: [FundingService]
})
export class FundingModule {}
