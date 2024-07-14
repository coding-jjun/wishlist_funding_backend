import { Notification } from "src/entities/notification.entity";
import { NotiType, ReqType } from "src/enums/notification.enum";

export class NotiDto {
  notiId: number;
  recvId: number;
  sendId?: number;
  sendNick?: string;
  sendImg?: string;
  notiType: NotiType;
  reqType: ReqType;
  subId: string;
  notiTime: Date;
  fundTitle?: string;

  constructor(notification: Notification) {
    this.notiId = notification.notiId;
    this.recvId = notification.recvId.userId;
    this.sendId = notification.sendId?.userId;
    this.sendNick = notification.sendId?.userNick;
    this.sendImg = notification.sendId?.image?.imgUrl;
    this.notiType = notification.notiType;
    this.reqType = notification.reqType;
    this.subId = notification.subId;
    this.notiTime = notification.notiTime;
    this.fundTitle = undefined;
  }
}