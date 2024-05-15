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

  @IsUrl()
  giftUrl: string;

  @IsNumber()
  giftOrd: number;

  @IsOptional()
  giftOpt?: string;

  @IsOptional()
  giftCont?: string;
}

export class GiftArray {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RequestGiftDto)
  gifts: RequestGiftDto[];
}
