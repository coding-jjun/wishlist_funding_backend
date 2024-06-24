import { IsNotEmpty, IsOptional } from 'class-validator';
import { NotiType, ReqType } from 'src/enums/notification.enum';

export class CreateNotificationDto {
  @IsNotEmpty()
  recvId: number;

  @IsNotEmpty()
  sendId: number;

  @IsNotEmpty()
  notiType: NotiType;

  @IsOptional()
  reqType?: ReqType;

  @IsOptional()
  subId?: string;
}
