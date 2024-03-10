import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from 'src/entities/notification.entity';
import { NotiType, ReqType } from 'src/enums/notification.enum';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Controller('api/notification')
export class NotificationController {
  constructor(
    private notificationService: NotificationService,
    // private appGateWay: AppGateWay,
  ) {}

  @Get('/:userId')
  findAllByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Notification[]> {
    return this.notificationService.findAllByUser(userId);
  }

  @Put('/:notiId')
  async update(
    @Param('notiId', ParseIntPipe) notiId: number,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    const newNoti = await this.notificationService.updateNotification(
      notiId,
      updateNotificationDto,
    );

    // if (newNoti.notiType == NotiType.FriendRequest && newNoti.reqType == ReqType.Accept) {
    //     this.appGateWay.notifyFriendResponse(newNoti);
    // }
    return newNoti;
  }
}
