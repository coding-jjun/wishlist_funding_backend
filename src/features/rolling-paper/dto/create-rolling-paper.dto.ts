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

  constructor(donId: number, rollMsg?: string, rollImg?: string) {
    this.donId = donId;
    this.rollMsg = rollMsg;
    this.rollImg = rollImg;
  }
}
