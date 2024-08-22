import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { Notification } from 'src/entities/notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Funding } from 'src/entities/funding.entity';
import { Donation } from 'src/entities/donation.entity';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { AuthModule } from '../auth/auth.module';
import { ValidCheck } from 'src/util/valid-check';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, User, Funding, Donation]), AuthModule],
  controllers: [NotificationController],
  providers: [NotificationService, GiftogetherExceptions],
})
export class NotificationModule {}
