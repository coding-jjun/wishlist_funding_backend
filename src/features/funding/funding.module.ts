import { Module } from '@nestjs/common';
import { FundingController } from './funding.controller';
import { FundingService } from './funding.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Funding } from '@entities/funding.entity';
import { User } from '@entities/user.entity';
import { Comment } from '@entities/comment.entity';
import { Friend } from '@entities/friend.entity';
import { GiftService } from '../gift/gift.service';
import { Gift } from '@entities/gift.entity';
import { Image } from '@entities/image.entity';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { FundingTasksService } from './funding.tasks.service';
import { Notification } from '@entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Funding, User, Comment, Friend, Gift, Image, Notification]),
  ],
  controllers: [FundingController],
  providers: [FundingService, GiftService, GiftogetherExceptions, FundingTasksService],
  exports: [FundingService],
})
export class FundingModule {}
