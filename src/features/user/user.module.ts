import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Account } from '@entities/account.entity';
import { Image } from '@entities/image.entity';
import { Address } from '@entities/address.entity';
import { AddressService } from '../address/address.service';
import { FundingService } from '../funding/funding.service';
import { Funding } from '@entities/funding.entity';
import { Friend } from '@entities/friend.entity';
import { GiftService } from '../gift/gift.service';
import { Gift } from '@entities/gift.entity';
import { GiftogetherExceptions } from '@filters/giftogether-exception';
import { Donation } from '@entities/donation.entity';
import { DonationService } from '../donation/donation.service';
import { RollingPaper } from '@entities/rolling-paper.entity';
import { RollingPaperService } from '../rolling-paper/rolling-paper.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Account, Image, Address, Funding, Friend, Gift, Donation, RollingPaper])],
  controllers: [UserController],
  providers: [UserService, AddressService, FundingService, GiftService, DonationService, RollingPaperService, GiftogetherExceptions],
  exports: [UserService],
})
export class UserModule {}
