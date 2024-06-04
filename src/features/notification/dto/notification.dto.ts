import { NotiType, ReqType } from "src/enums/notification.enum";

export class NotiDto {
  constructor(
    public notiId: string,
    public recvId: number,
    public sendId: number,
    public sendNick: string,
    public sendImg: string,
    public notiType: NotiType,
    public reqType: ReqType,
    public subId: number,
    public notiTime: Date,
  ) {}
}