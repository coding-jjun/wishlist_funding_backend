import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { ValidatorConfig } from 'src/config/validator.config';

export class CreateRollingPaperDto {
  @IsNumber()
  donId: number;

  @IsOptional()
  @IsString()
  rollMsg: string;

  /*
   * fundImg와 defaultImgId 둘 중에 하나만 null이어야 함
   */
  @IsOptional()
  @IsUrl(ValidatorConfig.IsUrlOptions)
  rollImg?: string;

  /*
   * fundImg와 defaultImgId 둘 중에 하나만 null이어야 함
   */
  @IsNumber()
  @IsOptional()
  defaultImgId?: number;

  constructor(
    donId: number,
    rollMsg?: string,
    rollImg?: string,
    /**
     * NULLABLE, null이라면 default image를 자동으로 적용합니다.
     */
    defaultImgId?: number,
  ) {
    this.donId = donId;
    this.rollMsg = rollMsg;
    this.rollImg = rollImg;
    this.defaultImgId = defaultImgId;
  }
}
