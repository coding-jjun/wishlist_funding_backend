import { IsOptional } from 'class-validator';

export class UpdateNotificationDto {
  @IsOptional()
  userId: number;

  @IsOptional()
  friendId: number;
}
