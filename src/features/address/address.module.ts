import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from 'src/entities/address.entity';
import { User } from 'src/entities/user.entity';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { AuthModule } from '../auth/auth.module';
import { ValidCheck } from 'src/util/valid-check';

@Module({
  imports: [TypeOrmModule.forFeature([Address, User]), AuthModule],
  controllers: [AddressController],
  providers: [AddressService, GiftogetherExceptions, ValidCheck],
  exports: [AddressService],
})
export class AddressModule {}
