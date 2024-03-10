import { IsNotEmpty } from 'class-validator';
import { ReqType } from 'src/enums/notification.enum';

export class UpdateNotificationDto {
  @IsNotEmpty()
  notiId: number;

  @IsNotEmpty()
  reqType: ReqType;
}
