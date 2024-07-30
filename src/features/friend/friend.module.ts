import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { Friend } from '@entities/friend.entity';
import { User } from '@entities/user.entity';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { NotificationService } from '../notification/notification.service';
import { Notification } from '@entities/notification.entity';
import { Funding } from '@entities/funding.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Friend, User, Notification])],
  controllers: [FriendController],
  providers: [FriendService, GiftogetherExceptions],
})
export class FriendModule {}
