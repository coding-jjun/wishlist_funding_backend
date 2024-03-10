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
import { UserController } from './features/user/user.controller';
import { UserService } from './features/user/user.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.local.env'],
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
      entities: [User, Funding, Comment],
    }),
    UserModule,
    FundingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
