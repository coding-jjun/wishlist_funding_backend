import { IsNotEmpty, IsNumber, IsOptional, IsUrl } from 'class-validator';
/**
 * SNS 가입 회원용 추가 회원가입 + 개인정보 업데이트 DTO
 */
export class UpdateUserDto {
  @IsNotEmpty()
  userNick: string;

  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  userPhone: string;

  @IsNotEmpty()
  userBirth: Date;

  /*
   * fundImg와 defaultImgId 둘 중에 하나만 null이어야 함
   */
  @IsOptional()
  @IsUrl()
  userImg?: string;

  /*
   * fundImg와 defaultImgId 둘 중에 하나만 null이어야 함
   */
  @IsOptional()
  @IsNumber()
  defaultImgId?: number;
}
