import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from 'src/entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { User } from 'src/entities/user.entity';
import { NotiDto } from './dto/notification.dto';
import { NotiType } from 'src/enums/notification.enum';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notiRepository: Repository<Notification>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllNoti(
    userId: number,
    lastDate?: Date
  ): Promise<{ noti: NotiDto[]; count: number; lastDate: Date; }> {
    const notifications = await this.notiRepository
      .createQueryBuilder('notification')
      .where('notification.recvId = :userId', { userId })
      .andWhere('notifications.notiTime < :lastDate', { lastDate })
      .take(20)
      .getMany();

    if (notifications.length > 0) {
      await this.notiRepository.createQueryBuilder('notification')
        .relation(Notification, 'recvId')
        .of(notifications.map(noti => noti.notiId)) // 필터링된 notiId만 조인
        .loadOne();
    }

    return {
      noti: notifications.map(noti => new NotiDto(noti)),
      count: notifications.length,
      lastDate: notifications[notifications.length - 1]?.notiTime,
    };
  }

  async createNoti(
    createNotiDto: CreateNotificationDto,
  ): Promise<Notification> {
    const noti = new Notification();
    const receiver = await this.userRepository.findOneBy({ userId: createNotiDto.recvId })
    const sender = await this.userRepository.findOneBy({ userId: createNotiDto.sendId })

    noti.sendId = sender;
    noti.recvId = receiver;
    noti.notiType = createNotiDto.notiType;
    noti.reqType = createNotiDto.reqType;
    noti.subId = createNotiDto.subId;

    return await this.notiRepository.save(noti);
  }

  async updateNoti(
    notiId: number,
    updateNotiDto: UpdateNotificationDto,
  ): Promise<Notification> {
    if (notiId) {
      const noti = await this.notiRepository.findOne({
        where: { notiId },
      });
      if (noti) {
        noti.reqType = updateNotiDto.reqType;
        await this.notiRepository.save(noti);
        return noti;
      }
    } else {
      const noti = await this.notiRepository.findOne({
        where: { 
          recvId: { userId: updateNotiDto.userId }, 
          sendId: { userId: updateNotiDto.friendId },
          notiType: NotiType.IncomingFollow,
        },
      });
      if (noti) {
        noti.reqType = updateNotiDto.reqType;
        await this.notiRepository.save(noti);
        return noti;
      }
    }
  }
}
