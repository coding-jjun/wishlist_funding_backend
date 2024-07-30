import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Funding } from '@entities/funding.entity';
import { User } from '@entities/user.entity';
import { Comment } from '@entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Funding, User, Comment])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
