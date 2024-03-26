import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommonResponse } from 'src/interfaces/common-response.interface';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /**
   * 댓글 생성
   */
  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  /**
   * 댓글 조회
   * @param id fundId로, 펀딩에 딸린 모든 댓글을 요청한다
   * @returns Comment[]
   */
  @Get()
  findMany(@Param('fundId') id: string): CommonResponse {
    return {
      timestamp: new Date(Date.now()),
      message: 'success',
      data: this.commentService.findMany(+id),
    };
  }

  /**
   * 댓글 수정
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  /**
   * 댓글 삭제
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
