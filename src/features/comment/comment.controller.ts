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
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommonResponse } from 'src/interfaces/common-response.interface';
import { JwtAuthGuard } from '../auth/guard/jwt-auth-guard';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /**
   * 댓글 생성
   */
  @Post(':fundUuid')
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('fundUuid', ParseUUIDPipe) fundUuid: string,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommonResponse> {
    return {
      data: await this.commentService.create(fundUuid, createCommentDto),
    };
  }

  /**
   * 댓글 조회
   * @param fundId 펀딩에 딸린 모든 댓글을 요청한다
   * @returns Comment[]
   */
  @Get(':fundUuid')
  async findMany(
    @Param('fundUuid', ParseUUIDPipe) fundUuid: string,
  ): Promise<CommonResponse> {
    return {
      message: 'success',
      data: await this.commentService.findMany(fundUuid),
    };
  }

  /**
   * 댓글 수정
   */
  @Put()
  @UseGuards(JwtAuthGuard)
  async update(
    @Query('fundId') fundId: number,
    @Query('comId') comId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<CommonResponse> {
    return {
      data: await this.commentService.update(fundId, comId, updateCommentDto),
    };
  }

  /**
   * 댓글 삭제
   */
  @Delete()
  @UseGuards(JwtAuthGuard)
  async remove(
    @Query('fundId') fundId: number,
    @Query('comId') comId: number,
  ): Promise<CommonResponse> {
    return {
      data: await this.commentService.remove(fundId, comId),
    };
  }
}
