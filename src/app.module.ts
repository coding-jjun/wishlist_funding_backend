import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './features/user/user.module';
import { DonationModule } from './features/donation/donation.module';

@Module({
  imports: [UserModule, DonationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
