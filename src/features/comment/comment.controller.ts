import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  Query,
  HttpException,
  HttpStatus,
  UseFilters,
  Put,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /**
   * 댓글 생성
   */
  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<any> {
    return {
      data: await this.commentService.create(createCommentDto),
    };
  }

  /**
   * 댓글 조회
   * @param fundId 펀딩에 딸린 모든 댓글을 요청한다
   * @returns Comment[]
   */
  @Get()
  async findMany(@Query('fundId') fundId: number): Promise<any> {
    Logger.log(`fundId: ${fundId}`);
    if (!fundId) {
      throw new HttpException(
        '`fundId` query is invalid',
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      message: 'success',
      data: await this.commentService.findMany(fundId),
    };
  }

  /**
   * 댓글 수정
   */
  @Put()
  async update(
    @Query('fundId') fundId: number,
    @Query('comId') comId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<any> {
    return {
      data: await this.commentService.update(fundId, comId, updateCommentDto),
    };
  }

  /**
   * 댓글 삭제
   */
  @Delete()
  async remove(
    @Query('fundId') fundId: number,
    @Query('comId') comId: number,
  ): Promise<any> {
    return {
      data: await this.commentService.remove(fundId, comId),
    };
  }
}
