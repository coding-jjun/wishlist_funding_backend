import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/guard/jwt-auth-guard';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';

@Module({
  imports: [AuthModule],
  controllers: [ImageController],
  providers: [ImageService, JwtAuthGuard, GiftogetherExceptions],
})
export class ImageModule {}
