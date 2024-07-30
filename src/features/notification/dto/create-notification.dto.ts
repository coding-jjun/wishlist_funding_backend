import { IsNotEmpty, IsOptional } from 'class-validator';
import { NotiType } from '@enums/noti-type.enum';

export class CreateNotificationDto {
  @IsNotEmpty()
  recvId: number;

  @IsNotEmpty()
  sendId: number;

  @IsNotEmpty()
  notiType: NotiType;

  @IsOptional()
  subId?: string;
}
