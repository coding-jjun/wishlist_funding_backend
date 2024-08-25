import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { GiftController } from './gift.controller';
import { GiftService } from './gift.service';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { Gift } from 'src/entities/gift.entity';
import { Funding } from 'src/entities/funding.entity';
import { Image } from 'src/entities/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gift, Funding, Image])],
  controllers: [GiftController],
  providers: [GiftService, GiftogetherExceptions],
  exports: [GiftService],
})
export class GiftModule {}
