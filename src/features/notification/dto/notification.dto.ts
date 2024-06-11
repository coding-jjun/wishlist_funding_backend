import { Notification } from "src/entities/notification.entity";
import { NotiType, ReqType } from "src/enums/notification.enum";

export class NotiDto {
  // constructor(
  //   public notiId: string,
  //   public recvId: number,
  //   public sendId: number,
  //   public sendNick: string,
  //   public sendImg: string,
  //   public notiType: NotiType,
  //   public reqType: ReqType,
  //   public subId: number,
  //   public notiTime: Date,
  // ) {}

  notiId: number;
  recvId: number;
  sendId: number;
  sendNick: string;
  // sendImg?: string;
  notiType: NotiType;
  reqType: ReqType;
  subId: number;
  notiTime: Date;

  constructor(notification: Notification) {
    this.notiId = notification.notiId;
    this.recvId = notification.recvId.userId;
    this.sendId = notification.sendId.userId;
    this.sendNick = notification.sendId.userNick;
    // this.sendImg? = notification.sendId.image;
    this.notiType = notification.notiType;
    this.reqType = notification.reqType;
    this.subId = notification.subId;
    this.notiTime = notification.notiTime;
  }
}