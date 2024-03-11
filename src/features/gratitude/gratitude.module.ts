import { Module } from '@nestjs/common';
import { GratitudeController } from './gratitude.controller';
import { GratitudeService } from './gratitude.service';

@Module({
  controllers: [GratitudeController],
  providers: [GratitudeService]
})
export class GratitudeModule {}
