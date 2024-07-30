import { Module } from '@nestjs/common';
import { RollingPaperController } from './rolling-paper.controller';
import { RollingPaperService } from './rolling-paper.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RollingPaper } from '@entities/rolling-paper.entity';
import { Funding } from '@entities/funding.entity';
import { Image } from '@entities/image.entity';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';

@Module({
  imports: [TypeOrmModule.forFeature([RollingPaper, Funding, Image])],
  controllers: [RollingPaperController],
  providers: [RollingPaperService, GiftogetherExceptions],
})
export class RollingPaperModule {}
