import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { Notification } from '@entities/notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@entities/user.entity';
import { Funding } from '@entities/funding.entity';
import { Donation } from '@entities/donation.entity';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, User, Funding, Donation])],
  controllers: [NotificationController],
  providers: [NotificationService, GiftogetherExceptions],
})
export class NotificationModule {}
