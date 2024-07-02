import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendDto } from './dto/friend.dto';
import { CommonResponse } from 'src/interfaces/common-response.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('friend')
export class FriendController {
  constructor(
    private readonly friendService: FriendService,
  ) {}

  @Get('/:userId')
  async getFriends(@Param('userId') userId: number): Promise<CommonResponse> {
    try {
      return {
        message: '친구 조회에 성공하였습니다.',
        data: await this.friendService.getFriends(userId),
      };
    } catch (error) {
      throw new HttpException('Failed to read friends', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':userId/:friendId')
  async friendStatus(
    @Param('userId') userId: number,
    @Param('friendId') friendId: number
  ): Promise<CommonResponse> {
    try {
      return {
        message: '친구 관계 조회에 성공하였습니다.',
        data: await this.friendService.friendStatus(userId, friendId)
      }
    } catch (error) {

    }
  }

  @Post('/')
  async createFriend(@Body() friendDto: FriendDto): Promise<CommonResponse> {
    try {
      const { result, message} =
        await this.friendService.createFriend(friendDto);

      // const noti = new CreateNotificationDto()
      // noti.recvId = friendDto.friendId;
      // noti.sendId = friendDto.userId;
      // noti.notiType = notiType;
      // switch (notiType) {
      //   case NotiType.AcceptFollow:
      //     const updateNoti = new UpdateNotificationDto();
      //     updateNoti.reqType = ReqType.Accept
      //     updateNoti.userId = friendDto.userId
      //     updateNoti.friendId = friendDto.friendId
      //     await this.notiService.updateNoti(friendDto.notiId, updateNoti);
      //   case NotiType.IncomingFollow:
      //     noti.reqType = ReqType.NotResponse;
      // }

      // await this.notiService.createNoti(noti);

      // switch (notiType) {
      //   case NotiType.AcceptFollow:
      //     this.eventEmitter.emit('AcceptFollow', result, notiType);
      //     break
      //   case NotiType.IncomingFollow:
      //     this.eventEmitter.emit('IncomingFollow', result, notiType);
      //     break
      // }
      
      return {
        message: message,
        data: result
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete('/')
  async deleteFriend(@Body() friendDto: FriendDto): Promise<CommonResponse> {
    try {
      const { result, message } =
        await this.friendService.deleteFriend(friendDto);

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
