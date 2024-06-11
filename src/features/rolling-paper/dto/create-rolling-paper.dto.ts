import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateRollingPaperDto {
  @IsNumber()
  donId: number;

  @IsOptional()
  @IsString()
  rollMsg: string;

  /**
   * NULLABLE, null이라면 default image를 자동으로 적용합니다.
   */
  @IsOptional()
  @IsUrl()
  rollImg?: string;

  @IsNumber()
  @IsOptional()
  defaultImgId?: number;

  constructor(
    donId: number,
    rollMsg?: string,
    rollImg?: string,
    defaultImgId?: number,
  ) {
    this.donId = donId;
    this.rollMsg = rollMsg;
    this.rollImg = rollImg;
    this.defaultImgId = defaultImgId;
  }
}
