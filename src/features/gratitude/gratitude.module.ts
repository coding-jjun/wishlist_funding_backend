import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gratitude } from '@entities/gratitude.entity';
import { GratitudeController } from './gratitude.controller';
import { GratitudeService } from './gratitude.service';
import { Funding } from '@entities/funding.entity';
import { GiftogetherExceptions } from '@filters/giftogether-exception';
import { Image } from '@entities/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gratitude, Funding, Image])],
  controllers: [GratitudeController],
  providers: [GratitudeService, GiftogetherExceptions],
})
export class GratitudeModule {}
