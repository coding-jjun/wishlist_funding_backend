import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotiType } from 'src/enums/noti-type.enum';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { CommonResponse } from 'src/interfaces/common-response.interface';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { JwtAuthGuard } from '../auth/guard/jwt-auth-guard';
import { Request } from 'express';
import { User } from 'src/entities/user.entity';

@Controller('notification')
export class NotificationController {
  constructor(
    private notiService: NotificationService,
    private readonly g2gException: GiftogetherExceptions,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAllByUser(
    @Req() req: Request,
    @Query('notiFilter', new DefaultValuePipe('all')) notiFilter: 'all' | 'friend' | 'funding' | 'comment',
    @Query('lastId', new DefaultValuePipe(undefined)) lastId?: number
  ): Promise<CommonResponse> {
    try {
      const user = req.user as { user: User } as any;

      return {
        data: await this.notiService.getAllNoti(user.userId, notiFilter, lastId),
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch('/read')
  @UseGuards(JwtAuthGuard)
  async readNoti(
    @Req() req: Request,
    @Body('lastTime') lastTime: Date,
  ): Promise<CommonResponse> {
    try {
      const user = req.user as { user: User } as any;
      
      return {
        data: await this.notiService.readNoti(lastTime, user.userId)
      };
    } catch (error) {
      throw error;
    }
  }

  // @Post('')
  // @UseGuards(JwtAuthGuard)
  // async create(
  //   @Body() createNotiDto: CreateNotificationDto,
  // ): Promise<CommonResponse> {
  //   try {
  //     let result;
  //     switch (createNotiDto.notiType) {
  //       case NotiType.IncomingFollow:
  //       case NotiType.NewFriend:
  //       case NotiType.FundClose:
  //       case NotiType.FundAchieve:
  //       case NotiType.NewDonate:
  //       case NotiType.DonatedFundClose:
  //       case NotiType.WriteGratitude:
  //         result = await this.notiService.createNoti(createNotiDto);
  //         break;
  //       case (NotiType.CheckGratitude):
  //         result = this.notiService.createMultiNoti(createNotiDto);
  //         break;
  //       default:
  //         throw this.g2gException.WrongNotiType;
  //     }
        
  //     return {
  //       message: '알림이 성공적으로 생성되었습니다.',
  //       data: result,
  //     };

  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // @Put('/:notiId')
  // async update(
  //   @Param('notiId', ParseIntPipe) notiId: number,
  //   @Body() updateNotificationDto: UpdateNotificationDto,
  // ): Promise<CommonResponse> {
  //   const newNoti = await this.notiService.updateNoti(
  //     notiId,
  //     updateNotificationDto,
  //   );

  //   // if (newNoti.notiType == NotiType.FriendRequest && newNoti.reqType == ReqType.Accept) {
  //   //     this.appGateWay.notifyFriendResponse(newNoti);
  //   // }
  //   return {
  //     data: newNoti,
  //   };
  // }
}
