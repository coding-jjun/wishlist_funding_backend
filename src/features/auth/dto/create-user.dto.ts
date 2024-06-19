import { IsNumber, IsOptional, IsUrl } from 'class-validator';
import { AuthType } from 'src/enums/auth-type.enum';

export class CreateUserDto {
  @IsOptional()
  authId: string;

  @IsOptional()
  authType: AuthType;

  @IsOptional()
  userNick: string;

  @IsOptional()
  userPw: string;

  @IsOptional()
  userName: string;

  @IsOptional()
  userPhone: string;

  @IsOptional()
  userBirth: Date;

  @IsOptional()
  @IsNumber()
  userAcc?: number;

  @IsOptional()
  userEmail?: string;

  @IsOptional()
  @IsUrl()
  userImg?: string;

}
