import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  userNick: string;

  @IsNotEmpty()
  userPw: string;
}
