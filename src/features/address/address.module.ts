import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from 'src/entities/address.entity';
import { User } from 'src/entities/user.entity';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';

@Module({
  imports: [TypeOrmModule.forFeature([Address, User])],
  controllers: [AddressController],
  providers: [AddressService, GiftogetherExceptions],
  exports: [AddressService],
})
export class AddressModule {}
