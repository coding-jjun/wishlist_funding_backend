import { Module } from '@nestjs/common';
import { RollingPaperController } from './rolling-paper.controller';
import { RollingPaperService } from './rolling-paper.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RollingPaper } from 'src/entities/rolling-paper.entity';
import { Funding } from 'src/entities/funding.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RollingPaper, Funding])],
  controllers: [RollingPaperController],
  providers: [RollingPaperService],
})
export class RollingPaperModule {}
