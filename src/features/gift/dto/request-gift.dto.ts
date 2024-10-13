import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { ValidatorConfig } from 'src/config/validator.config';

export class RequestGiftDto {
  @IsOptional()
  @IsNumber()
  giftId?: number;

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

  @IsOptional()
  @IsUrl(ValidatorConfig.IsUrlOptions)
  giftImg?: string;
}

export class GiftArray {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RequestGiftDto)
  gifts: RequestGiftDto[];
}
