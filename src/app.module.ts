import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationModule } from './features/notification/notification.module';
import { UserModule } from './features/user/user.module';
import { FundingModule } from './features/funding/funding.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Funding } from './entities/funding.entity';
import { Comment } from './entities/comment.entity';
import { Donation } from './entities/donation.entity';
import { RollingPaper } from './entities/rollingPaper.entity';
import { DonationModule } from './features/donation/donation.module';
import { RollingPaperModule } from './features/rolling-paper/rolling-paper.module';

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
      entities: [User, Funding, Comment, Donation, RollingPaper],
    }),
    UserModule,
    FundingModule,
    DonationModule,
    RollingPaperModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
