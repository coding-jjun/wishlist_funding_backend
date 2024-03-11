import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gratitude } from 'src/entities/gratitude.entity';
import { GratitudeController } from './gratitude.controller';
import { GratitudeService } from './gratitude.service';

@Module({
  imports: [TypeOrmModule.forFeature([Gratitude])],
  controllers: [GratitudeController],
  providers: [GratitudeService],
})
export class GratitudeModule {}
