import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '@entities/account.entity';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { User } from '@entities/user.entity';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';

@Module({
  imports: [TypeOrmModule.forFeature([Account, User])],
  controllers: [AccountController],
  providers: [AccountService, GiftogetherExceptions],
  exports: [AccountService],
})
export class AccountModule {}
