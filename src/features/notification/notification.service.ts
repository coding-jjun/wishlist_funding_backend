import { Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from 'src/entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { User } from 'src/entities/user.entity';
import { NotiDto } from './dto/notification.dto';
import { NotiType, ReqType } from 'src/enums/notification.enum';
import { Donation } from 'src/entities/donation.entity';
import { Funding } from 'src/entities/funding.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { FriendDto } from '../friend/dto/friend.dto';
import { Friend } from 'src/entities/friend.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notiRepository: Repository<Notification>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Funding)
    private fundRepository: Repository<Funding>,

    @InjectRepository(Donation)
    private donationRepository: Repository<Donation>,
  ) {}

  async getAllNoti(
    userId: number,
    notiType?: NotiType,
    lastDate?: Date,
  ): Promise<{ noti: NotiDto[]; count: number; lastDate: Date; }> {
    const queryBuilder = this.notiRepository
      .createQueryBuilder('notification')
      .where('notification.recvId = :userId', { userId })
      .orderBy('notification.notiTime', 'DESC');      

    console.log('서비스' + lastDate);

    // lastDate가 제공되었다면, 이를 사용하여 조건 추가
    if (lastDate) {
      const adjustedDate = new Date(lastDate);
      adjustedDate.setHours(adjustedDate.getHours() + 9);

      queryBuilder.andWhere('notification.notiTime < :lastDate', { lastDate: adjustedDate });
    }

    const notifications = await queryBuilder
    .take(4)
    .leftJoinAndSelect('notification.recvId', 'receiver')
    .leftJoinAndSelect('notification.sendId', 'sender')
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

  @OnEvent('AcceptFollow')
  async handleAcceptFollow(data: { friendDto: FriendDto, notiType: NotiType }) {
    const noti = new Notification();
    const receiver = await this.userRepository.findOneBy({ userId: data.friendDto.friendId })
    const sender = await this.userRepository.findOneBy({ userId: data.friendDto.userId })

    noti.sendId = sender;
    noti.recvId = receiver;
    noti.notiType = data.notiType;

    return await this.notiRepository.save(noti);
  }

  @OnEvent('IncomingFollow')
  async handleIncomingFollow(data: { friendDto: FriendDto, notiType: NotiType }) {
    const noti = new Notification();
    const receiver = await this.userRepository.findOneBy({ userId: data.friendDto.friendId })
    const sender = await this.userRepository.findOneBy({ userId: data.friendDto.userId })

    noti.sendId = sender;
    noti.recvId = receiver;
    noti.notiType = data.notiType;
    noti.reqType = ReqType.NotResponse;

    return await this.notiRepository.save(noti);
  }

  @OnEvent('FundAchieve')
  async handleFundAchieve(data: {recvId: number, notiType: NotiType, subId: string}) {
    const noti = new Notification();
    const receiver = await this.userRepository.findOneBy({ userId: data.recvId });

    noti.recvId = receiver;
    noti.notiType = data.notiType;
    noti.subId = data.subId;

    return await this.notiRepository.save(noti);
  }

  @OnEvent('NewDonate')
  async handleNewDonate(data: {recvId: number, sendId: number, notiType: NotiType, subId: string}) {
    const noti = new Notification();
    const receiver = await this.userRepository.findOneBy({ userId: data.recvId })
    const sender = await this.userRepository.findOneBy({ userId: data.sendId })
    
    noti.sendId = sender;
    noti.recvId = receiver;
    noti.notiType = data.notiType;
    noti.subId = data.subId;
  
    return await this.notiRepository.save(noti);
  }

  @OnEvent('DonatedFundClose')
  async handleDonatedFundClose(fundId: number) {
    const funding = await this.fundRepository.findOne({
      where: { fundId },
      relations: ['fundUser', 'donations', 'donations.user']
    });

  
    // 해당 펀딩에 기여한 모든 사용자들에게 알림을 생성
    const notifications = funding.donations.map(donation => {
      const noti = new Notification();
      noti.recvId = donation.user; // 받는 사람은 기부자
      noti.sendId = funding.fundUser; // 보내는 사람은 펀딩 주최자
      noti.notiType = NotiType.CheckGratitude; // 알림 타입 설정
      noti.subId = funding.fundUuid;
  
      return this.notiRepository.save(noti);
    });
  
    // 모든 알림을 비동기적으로 저장
    await Promise.all(notifications);
  }
  
  @OnEvent('WriteGratitude')
  async handleWriteGratitude(fundId: number) {
    const noti = new Notification();
    const funding = await this.fundRepository.findOne({
      where: { fundId },
      relations: ['fundUser'],
    });

    noti.recvId = funding.fundUser;
    noti.notiType = NotiType.WriteGratitude;
    noti.reqType = ReqType.NotResponse;
    noti.subId = funding.fundUuid;

    return this.notiRepository.save(noti);
  }

  @OnEvent('CheckGratitude')
  async handleCheckGratitude(fundId: number) {
    const funding = await this.fundRepository.findOne({
      where: { fundId },
      relations: ['fundUser', 'donations', 'donations.user']
    });
  
    // 해당 펀딩에 기여한 모든 사용자들에게 알림을 생성
    const notifications = funding.donations.map(donation => {
      const noti = new Notification();
      noti.recvId = donation.user; // 받는 사람은 기부자
      noti.sendId = funding.fundUser; // 보내는 사람은 펀딩 주최자
      noti.notiType = NotiType.CheckGratitude; // 알림 타입 설정
      noti.subId = funding.fundUuid;
  
      return this.notiRepository.save(noti);
    });
  
    // 모든 알림을 비동기적으로 저장
    await Promise.all(notifications);
  }

  @OnEvent('NewComment')
  async handleNewComment(data: { fundId: number, authorId: number }) {
    const noti = new Notification();
    const funding = await this.fundRepository.findOne({
      where: { fundId: data.fundId },
      relations: ['fundUser'],
    });
    const sender = await this.userRepository.findOne({ where: { userId: data.authorId }});

    noti.recvId = funding.fundUser;
    noti.sendId = sender;
    noti.notiType = NotiType.NewComment;
    noti.subId = funding.fundUuid;

    return this.notiRepository.save(noti);
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

  async createMultiNoti(
    createNotiDto: CreateNotificationDto,
  ): Promise<Notification[]> {
    const notifications: Notification[] = [];

    let funding;
    let donations;
    switch (createNotiDto.notiType) {
      case (NotiType.CheckGratitude):
        funding = await this.fundRepository.findOne({
          where: { fundId: Number(createNotiDto.subId) },
          relations: ['fundUser']
        });        

        donations = await this.donationRepository.find({
          where: { funding: { fundId: Number(createNotiDto.subId) } },
          relations: ['user']
        });
        break;
      case (NotiType.DonatedFundClose):
        funding = await this.fundRepository.findOne({
          where: { fundUuid: createNotiDto.subId },
          relations: ['fundUser']
        })

        donations = await this.donationRepository.find({
          where: { funding: { fundUuid: createNotiDto.subId } },
          relations: ['user']
        });
        break;
    }

    console.log("--------------funding.fundId :" + funding.fundId);

    for (const donation of donations) {
      const noti = new Notification();
      noti.recvId = donation.user;
      noti.sendId = funding.fundUser;
      noti.notiType = createNotiDto.notiType;
      noti.subId = createNotiDto.subId

      const savedNoti = await this.notiRepository.save(noti);
      notifications.push(savedNoti);
    }

    return notifications;
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
