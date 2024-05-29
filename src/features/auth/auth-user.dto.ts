import { IsNotEmpty } from 'class-validator';

export class AuthUserDto {
  @IsNotEmpty()
  userNick: string;

  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  userPhone: string;

  @IsNotEmpty()
  userBirth: Date;

  @IsNotEmpty()
  userAcc: number;

  @IsNotEmpty()
  userImg: number;
}
