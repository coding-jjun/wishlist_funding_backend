import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from 'src/entities/notification.entity';
import { CreateNotificationDto } from './dto/createNotification.dto';
import { UpdateNotificationDto } from './dto/updateNotification.dto';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,
    ) {}

    async findAllByUser(userId: number): Promise<Notification[]> {
        const notifications = await this.notificationRepository.createQueryBuilder('notification')

        return notifications;
    }

    async createNotification(createNotificationDto: CreateNotificationDto): Promise<Notification> {
        const noti = new Notification();

        noti.sendId = createNotificationDto.sendId;
        noti.recvId = createNotificationDto.recvId;
        noti.notiType = createNotificationDto.notiType;
        noti.reqType = createNotificationDto.reqType;
        noti.subId = createNotificationDto.subId;

        return await this.notificationRepository.save(noti);
    }

    async updateNotification(notiId: number, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
        const noti = await this.notificationRepository.findOne({ where: { notiId }});
        if (noti) {
            noti.reqType = updateNotificationDto.reqType;
            await this.notificationRepository.save(noti);
            return noti;
        }
    }
}
