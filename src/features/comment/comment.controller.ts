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
  Req,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommonResponse } from 'src/interfaces/common-response.interface';
import { JwtAuthGuard } from '../auth/guard/jwt-auth-guard';
import { Request } from 'express';
import { User } from 'src/entities/user.entity';

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
    @Req() req: Request,
  ): Promise<CommonResponse> {
    const user = req.user as Partial<User>;
    return {
      data: await this.commentService.create(user, fundUuid, createCommentDto),
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
   * @permission 해당 댓글 작성자
   * @param fundUuid Path Param
   * @param comId Query Param
   * @param updateCommentDto 변경될 데이터
   */
  @Put(':fundUuid')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('fundUuid', ParseUUIDPipe) fundUuid: string,
    @Query('comId') comId: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: Request,
  ): Promise<CommonResponse> {
    const user = req.user as Partial<User>;
    return {
      data: await this.commentService.update(
        user,
        fundUuid,
        comId,
        updateCommentDto,
      ),
    };
  }

  /**
   * 댓글 삭제
   * @permission 해당 댓글 작성자
   * @param fundUuid Path Param
   * @param comId Query Param
   */
  @Delete(':fundUuid')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('fundUuid', ParseUUIDPipe) fundUuid: string,
    @Query('comId') comId: number,
    @Req() req: Request,
  ): Promise<CommonResponse> {
    const user = req.user as Partial<User>;
    return {
      data: await this.commentService.remove(user, fundUuid, comId),
    };
  }
}
