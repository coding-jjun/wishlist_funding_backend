import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { Friend } from 'src/entities/friend.entity';
import { User } from 'src/entities/user.entity';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { NotificationService } from '../notification/notification.service';
import { Notification } from 'src/entities/notification.entity';
import { Funding } from 'src/entities/funding.entity';
import { AuthModule } from '../auth/auth.module';
import { ValidCheck } from 'src/util/valid-check';

@Module({
  imports: [TypeOrmModule.forFeature([Friend, User, Notification]), AuthModule],
  controllers: [FriendController],
  providers: [FriendService, GiftogetherExceptions, ValidCheck],
})
export class FriendModule {}
