import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gratitude } from 'src/entities/gratitude.entity';
import { GratitudeController } from './gratitude.controller';
import { GratitudeService } from './gratitude.service';
import { Funding } from 'src/entities/funding.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gratitude, Funding])],
  controllers: [GratitudeController],
  providers: [GratitudeService],
})
export class GratitudeModule {}
