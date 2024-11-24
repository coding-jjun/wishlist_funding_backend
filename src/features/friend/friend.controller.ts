import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendDto } from './dto/friend.dto';
import { CommonResponse } from 'src/interfaces/common-response.interface';
import { JwtAuthGuard } from '../auth/guard/jwt-auth-guard';
import { Request } from 'express';
import { User } from 'src/entities/user.entity';

@Controller('friend')
export class FriendController {
  constructor(
    private readonly friendService: FriendService,
  ) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getFriends(
    @Req() req: Request
  ): Promise<CommonResponse> {
    try {
      const user = req.user as { user: User } as any;

      return {
        message: '친구 조회에 성공하였습니다.',
        data: await this.friendService.getFriends(user.userId),
      };
    } catch (error) {
      throw new HttpException('Failed to read friends', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/:userId/:friendId')
  @UseGuards(JwtAuthGuard)
  async friendStatus(
    @Param('userId') userId: number,
    @Param('friendId') friendId: number,
    @Req() req: Request
  ): Promise<CommonResponse> {
    try {
      const user = req.user as { user: User } as any;

      return {
        message: '친구 관계 조회에 성공하였습니다.',
        data: await this.friendService.friendStatus(user.userId, userId, friendId)
      }
    } catch (error) {

    }
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async createFriend(
    @Body() friendDto: FriendDto,
    @Req() req: Request
  ): Promise<CommonResponse> {
    try {
      const user = req.user as { user: User } as any;
      
      const { result, message } =
        await this.friendService.createFriend(user.userId, friendDto);
      
      return {
        message: message,
        data: result
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete('/')
  @UseGuards(JwtAuthGuard)
  async deleteFriend(
    @Body() friendDto: FriendDto,
    @Req() req: Request
  ): Promise<CommonResponse> {
    try {
      const user = req.user as { user: User } as any;

      const { result, message } =
        await this.friendService.deleteFriend(user.userId, friendDto);

      return {
        message: message,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to delete friend',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
