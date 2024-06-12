import { IsNotEmpty, IsNumber, IsOptional, IsUrl } from 'class-validator';

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
  @IsUrl()
  userImg?: string;

  @IsNumber()
  @IsOptional()
  defaultImgId?: number;
}
