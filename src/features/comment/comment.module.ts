import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Funding } from 'src/entities/funding.entity';
import { User } from 'src/entities/user.entity';
import { Comment } from 'src/entities/comment.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/guard/jwt-auth-guard';
import { JwtService } from '@nestjs/jwt';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { ValidCheck } from 'src/util/valid-check';

@Module({
  imports: [TypeOrmModule.forFeature([Funding, User, Comment]), AuthModule],
  controllers: [CommentController],
  providers: [CommentService, JwtService, GiftogetherExceptions, ValidCheck],
})
export class CommentModule {}
