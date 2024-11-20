import { Notification } from "src/entities/notification.entity";
import { NotiType } from "src/enums/noti-type.enum";

export class NotiDto {
  notiId: number;
  recvId: number;
  sendId?: number;
  sendNick?: string;
  sendImg?: string;
  notiType: NotiType;
  subId: string;
  notiTime: Date;
  isRead: boolean;
  fundTitle?: string;

  constructor(notification: Notification) {
    this.notiId = notification.notiId;
    this.recvId = notification.recvId.userId;
    this.sendId = notification.sendId?.userId;
    this.sendNick = notification.sendId?.userNick;
    this.sendImg = notification.sendId?.image ? notification.sendId.image.imgUrl : '';
    this.notiType = notification.notiType;
    this.subId = notification.subId;
    this.notiTime = notification.notiTime;
    this.isRead = notification.isRead;
    this.fundTitle = undefined;
  }
}