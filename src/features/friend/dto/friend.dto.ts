import { IsNotEmpty } from 'class-validator';

export class FriendDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  friendId: number;
}
