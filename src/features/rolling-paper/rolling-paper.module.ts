import { Module } from '@nestjs/common';
import { RollingPaperController } from './rolling-paper.controller';
import { RollingPaperService } from './rolling-paper.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RollingPaper } from 'src/entities/rolling-paper.entity';
import { Funding } from 'src/entities/funding.entity';
import { Image } from 'src/entities/image.entity';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { AuthModule } from '../auth/auth.module';
import { ValidCheck } from 'src/util/valid-check';
import { User } from 'src/entities/user.entity';
import { ImageService } from '../image/image.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RollingPaper, Funding, Image, User]),
    AuthModule,
  ],
  controllers: [RollingPaperController],
  providers: [RollingPaperService, GiftogetherExceptions, ValidCheck, ImageService],
})
export class RollingPaperModule {}
