import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationModule } from './notification/notification.module';
import { UserModule } from './features/user/user.module';
import { FriendModule } from './features/friend/friend.module';

@Module({
  imports: [NotificationModule, UserModule, FriendModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
