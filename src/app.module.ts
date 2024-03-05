import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationModule } from './notification/notification.module';
import { UserModule } from './features/user/user.module';

@Module({
  imports: [NotificationModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
