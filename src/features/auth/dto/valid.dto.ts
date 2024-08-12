import { IsEmail, IsOptional } from 'class-validator';

export class ValidDto {
  @IsEmail()
  @IsOptional()
  userEmail: string;

  @IsOptional()
  userNick: string;

  @IsOptional()
  userPhone: string;
}
