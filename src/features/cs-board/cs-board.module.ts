import { Module } from '@nestjs/common';
import { CsBoardService } from './cs-board.service';
import { CsBoardController } from './cs-board.controller';

@Module({
  providers: [CsBoardService],
  controllers: [CsBoardController]
})
export class CsBoardModule {}
