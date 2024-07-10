import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/entities/account.entity';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { User } from 'src/entities/user.entity';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';

@Module({
  imports: [TypeOrmModule.forFeature([Account, User])],
  controllers: [AccountController],
  providers: [AccountService, GiftogetherExceptions],
  exports: [AccountService],
})
export class AccountModule {}
