import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotiType } from 'src/enums/noti-type.enum';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { CommonResponse } from 'src/interfaces/common-response.interface';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';

@Controller('notification')
export class NotificationController {
  constructor(
    private notiService: NotificationService,
    private readonly g2gException: GiftogetherExceptions,

    // private appGateWay: AppGateWay,
  ) {}

  @Get('/:userId')
  async findAllByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('notiFilter', new DefaultValuePipe('all')) notiFilter: 'all' | 'friend' | 'funding' | 'comment',
    @Query('lastId', new DefaultValuePipe(undefined)) lastId?: number,
  ): Promise<CommonResponse> {
    return {
      data: await this.notiService.getAllNoti(userId, notiFilter, lastId),
    };
  }

  @Post('')
  async create(
    @Body() createNotiDto: CreateNotificationDto,
  ): Promise<CommonResponse> {
    try {
      let result;
      switch (createNotiDto.notiType) {
        case NotiType.IncomingFollow:
        case NotiType.NewFriend:
        case NotiType.FundClose:
        case NotiType.FundAchieve:
        case NotiType.NewDonate:
        case NotiType.DonatedFundClose:
        case NotiType.WriteGratitude:
          result = await this.notiService.createNoti(createNotiDto);
          break;
        case (NotiType.CheckGratitude):
          result = this.notiService.createMultiNoti(createNotiDto);
          break;
        default:
          throw this.g2gException.WrongNotiType;
      }
        
      return {
        message: '알림이 성공적으로 생성되었습니다.',
        data: result,
      };

    } catch (error) {
      throw error;
    }
  }

  @Put('/:notiId')
  async update(
    @Param('notiId', ParseIntPipe) notiId: number,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ): Promise<CommonResponse> {
    const newNoti = await this.notiService.updateNoti(
      notiId,
      updateNotificationDto,
    );

    // if (newNoti.notiType == NotiType.FriendRequest && newNoti.reqType == ReqType.Accept) {
    //     this.appGateWay.notifyFriendResponse(newNoti);
    // }
    return {
      data: newNoti,
    };
  }
}
