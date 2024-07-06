import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  userNick: string;

  @IsNotEmpty()
  userPw: string;
}
