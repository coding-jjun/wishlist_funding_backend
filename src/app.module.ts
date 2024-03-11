import { Module } from '@nestjs/common';
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
import { Gratitude } from './entities/gratitude.entity';
import { GratitudeModule } from './features/gratitude/gratitude.module';

@Module({
  imports: [
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
      entities: [User, Funding, Comment, Donation, RollingPaper, Notification, Friend, Gratitude],
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
    GratitudeModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
