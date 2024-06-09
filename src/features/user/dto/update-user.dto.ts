import { IsNotEmpty, IsNumber, IsOptional, IsUrl } from 'class-validator';

export class UpdateUserDto {
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

  @IsNotEmpty()
  userEmail: string;

  @IsOptional()
  @IsNumber()
  userAcc: number;

  @IsOptional()
  @IsUrl()
  userImg?: string;
}
