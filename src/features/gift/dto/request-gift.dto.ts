import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUrl,
  ValidateNested,
} from 'class-validator';

export class RequestGiftDto {
  @IsOptional()
  @IsNumber()
  giftId?: number;

  @IsNotEmpty()
  giftTitle: string;

  @IsNotEmpty()
  @IsUrl()
  giftUrl: string;

  @IsNotEmpty()
  @IsNumber()
  giftOrd: number;

  @IsOptional()
  giftOpt?: string;

  @IsOptional()
  giftCont?: string;

  /**
   * giftImg는 썸네일 URL도 가능하기 때문에 커스텀 Validator 미적용
   */
  @IsOptional()
  @IsUrl()
  giftImg?: string;
}

export class GiftArray {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RequestGiftDto)
  gifts: RequestGiftDto[];
}
