import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationModule } from './features/notification/notification.module';
import { UserModule } from './features/user/user.module';
import { FriendModule } from './features/friend/friend.module';
import { FundingModule } from './features/funding/funding.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Funding } from './entities/funding.entity';
import { Comment } from './entities/comment.entity';
import { Donation } from './entities/donation.entity';
import { RollingPaper } from './entities/rolling-paper.entity';
import { DonationModule } from './features/donation/donation.module';
import { RollingPaperModule } from './features/rolling-paper/rolling-paper.module';
import { readFileSync } from 'fs';
import { Friend } from './entities/friend.entity';
import { Address } from './entities/address.entity';
import { AddressModule } from './features/address/address.module';
import { CommentModule } from './features/comment/comment.module';
import { Gratitude } from './entities/gratitude.entity';
import { GratitudeModule } from './features/gratitude/gratitude.module';
import { Image } from './entities/image.entity';
import { Notification } from './entities/notification.entity';
import { TokenModule } from './features/open-bank/token/token.module';
import { OpenBankToken } from './entities/open-bank-token.entity';
import { Account } from './entities/account.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ImageModule } from './features/image/image.module';
import { Gift } from './entities/gift.entity';
import { GiftModule } from './features/gift/gift.module';
import { GiftogetherError } from './entities/error.entity';
import { ExceptionModule } from './filters/exception.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './transform/transform.interceptor';
import { AuthModule } from './features/auth/auth.module';
import { RedisModule } from './features/auth/redis.module';
import { EventModule } from './features/event/event.module';
import { AccountModule } from './features/account/account.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ValidCheckModule } from './util/valid-check.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      // cache: true,
      expandVariables: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 5432,
      password: process.env.DB_DEV_PASSWORD,
      username: process.env.DB_DEV_USERNAME,
      database: process.env.DB_DEV_DATABASE,
      synchronize: true,
      logging: true,
      entities: [
        Account,
        User,
        Funding,
        Comment,
        Donation,
        RollingPaper,
        Notification,
        Friend,
        Address,
        Gratitude,
        Image,
        OpenBankToken,
        Account,
        Gift,
        GiftogetherError,
      ],
      ssl: {
        ca: readFileSync('global-bundle.pem'),
      },
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
    UserModule,
    FundingModule,
    DonationModule,
    RollingPaperModule,
    FriendModule,
    NotificationModule,
    AddressModule,
    CommentModule,
    GratitudeModule,
    TokenModule,
    MulterModule,
    ImageModule,
    GiftModule,
    ExceptionModule,
    AuthModule,
    RedisModule,
    EventModule,
    AccountModule,
    ValidCheckModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}

export function getNow(): string {
  const event = new Date();
  event.setTime(event.getTime() - event.getTimezoneOffset() * 60 * 1000);
  return event.toISOString();
}
