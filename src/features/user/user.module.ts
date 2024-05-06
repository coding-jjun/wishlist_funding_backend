import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Account } from 'src/entities/account.entity';
import { Image } from 'src/entities/image.entity';
import { Address } from 'src/entities/address.entity';
import { AddressService } from '../address/address.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Account, Image, Address])],
  controllers: [UserController],
  providers: [UserService, AddressService],
  exports: [UserService],
})
export class UserModule {}
