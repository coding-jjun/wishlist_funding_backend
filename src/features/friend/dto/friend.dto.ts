import { IsNotEmpty, IsOptional } from 'class-validator';

export class FriendDto {
  @IsNotEmpty()
  friendId: number;

  @IsOptional()
  notiId: number;
}
