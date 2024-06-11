import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { Friend } from 'src/entities/friend.entity';
import { User } from 'src/entities/user.entity';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { NotificationService } from '../notification/notification.service';
import { Notification } from 'src/entities/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Friend, User, Notification])],
  controllers: [FriendController],
  providers: [FriendService, NotificationService, GiftogetherExceptions],
})
export class FriendModule {}
