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
import { NotiType } from 'src/enums/notification.enum';
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
    @Query('lastDate', new DefaultValuePipe(undefined)) lastDate?: Date,
  ): Promise<CommonResponse> {

    console.log('컨트롤러' + lastDate);

    return {
      data: await this.notiService.getAllNoti(userId, lastDate),
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
        case NotiType.AcceptFollow:
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

  /**
   * 본 스케줄 핸들러는 AWS 람다함수가 호출할 예정입니다. 아래 세 이벤트는 스케줄러에 의해 서버가 발행하는 이벤트입니다.
   * 자세한 이벤트 관련한 문서는 [Notification](https://www.notion.so/Notification-461c1a5bb350450a9c1aa696a2a05f8e?pvs=4)을 참조하세요.
   *
   * 1. FundClose
   * 2. DonatedFundClose
   * 3. WriteGratitude
   *
   * TODO - 람다함수만이 이 함수를 호출할 수 있도록 AuthGuard를 설정해야 합니다.
   */
  @Post('schedule')
  async schedule(): Promise<CommonResponse> {
    return {
      message: '왔니',
      data: null,
    };
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
