import { IsNotEmpty, IsOptional } from 'class-validator';

export class FriendDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  friendId: number;

  @IsOptional()
  notiId: number;
}
