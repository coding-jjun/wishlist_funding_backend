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

  /*
   * fundImg와 defaultImgId 둘 중에 하나만 null이어야 함
   */
  @IsOptional()
  @IsUrl()
  userImg?: string;

  /*
   * fundImg와 defaultImgId 둘 중에 하나만 null이어야 함
   */
  @IsNumber()
  @IsOptional()
  defaultImgId?: number;
}
