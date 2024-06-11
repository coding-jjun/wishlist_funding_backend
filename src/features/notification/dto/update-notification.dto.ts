import { IsNotEmpty, IsOptional } from 'class-validator';
import { ReqType } from 'src/enums/notification.enum';

export class UpdateNotificationDto {
  @IsNotEmpty()
  reqType: ReqType;

  @IsOptional()
  userId: number;

  @IsOptional()
  friendId: number;
}
