import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './features/user/user.module';
import { FriendModule } from './features/friend/friend.module';

@Module({
  imports: [UserModule, FriendModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
