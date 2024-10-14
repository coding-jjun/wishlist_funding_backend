import { IsNumber, IsOptional, Validate } from 'class-validator';
import { CustomUrlValidator } from 'src/util/custom-url-validator';

export class UpdateUserDto {
  @IsOptional()
  userNick?: string;
  
  @IsOptional()
  userPw?: string;

  @IsOptional()
  userName?: string;

  @IsOptional()
  userPhone?: string;

  @IsOptional()
  userBirth?: Date;

  /*
   * fundImg와 defaultImgId 둘 중에 하나만 null이어야 함
   */
  @IsOptional()
  @Validate(CustomUrlValidator)
  userImg?: string;

  @IsOptional()
  @IsNumber()
  defaultImgId?: number;
}

