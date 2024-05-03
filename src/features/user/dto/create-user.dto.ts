import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

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

  @IsOptional()
  @IsNumber()
  userAcc?: number;

  @IsOptional()
  userEmail?: string;

  @IsOptional()
  @IsNumber()
  userImg?: number;
}
