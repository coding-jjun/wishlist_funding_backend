import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  userNick: string;

  @IsNotEmpty()
  userPw: string;

  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  userPhone: string;

  @IsNotEmpty()
  userBirth: Date;

  accId: number;

  userEmail: string;

  userImg: number;
}
