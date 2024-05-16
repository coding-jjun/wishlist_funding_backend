import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Account } from 'src/entities/account.entity';
import { Image } from 'src/entities/image.entity';
import { Address } from 'src/entities/address.entity';
import { AddressService } from '../address/address.service';
import { FundingService } from '../funding/funding.service';
import { Funding } from 'src/entities/funding.entity';
import { Friend } from 'src/entities/friend.entity';
import { GiftService } from '../gift/gift.service';
import { Gift } from 'src/entities/gift.entity';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';

@Module({
  imports: [TypeOrmModule.forFeature([User, Account, Image, Address, Funding, Friend, Gift])],
  controllers: [UserController],
  providers: [UserService, AddressService, FundingService, GiftService, GiftogetherExceptions],
  exports: [UserService],
})
export class UserModule {}
