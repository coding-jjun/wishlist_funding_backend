import { IsNumber, IsOptional, Validate } from 'class-validator';
import { AuthType } from 'src/enums/auth-type.enum';
import { CustomUrlValidator } from 'src/util/custom-url-validator';

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
  userEmail?: string;

  /**
   * fundImg와 defaultImgId 둘 중에 하나만 null이어야 함
   */
  @IsOptional()
  @Validate(CustomUrlValidator)
  userImg?: string;

  /**
   * fundImg와 defaultImgId 둘 중에 하나만 null이어야 함
   */
  @IsNumber()
  @IsOptional()
  defaultImgId?: number;
}
