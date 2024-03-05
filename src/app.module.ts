import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './features/user/user.module';
import { FundingModule } from './features/funding/funding.module';

@Module({
  imports: [UserModule, FundingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
