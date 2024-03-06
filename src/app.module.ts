import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './features/user/user.module';
import { RollingPaperModule } from './features/rolling-paper/rolling-paper.module';

@Module({
  imports: [UserModule],
  controllers: [AppController, RollingPaperModule],
  providers: [AppService],
})
export class AppModule {}
