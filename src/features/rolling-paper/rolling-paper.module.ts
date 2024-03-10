import { Module } from '@nestjs/common';
import { RollingPaperController } from './rolling-paper.controller';
import { RollingPaperService } from './rolling-paper.service';

@Module({
  controllers: [RollingPaperController],
  providers: [RollingPaperService],
})
export class RollingPaperModule {}
