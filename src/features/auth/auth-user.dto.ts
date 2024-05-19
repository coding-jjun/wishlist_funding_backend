import { IsOptional } from 'class-validator';

export class AuthUserDto {
  @IsOptional()
  userNick?: string;

  @IsOptional()
  userName?: string;

  @IsOptional()
  userPhone?: string;

  @IsOptional()
  userBirth?: Date;

  @IsOptional()
  userAcc?: number;

  @IsOptional()
  userImg?: number;
}
