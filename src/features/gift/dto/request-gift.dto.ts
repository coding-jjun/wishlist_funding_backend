import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from "class-validator";

export class RequestGiftDto {
  @IsOptional()
  @IsNumber()
  giftId?: number;

  @IsNotEmpty()
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