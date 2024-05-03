import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class UpdateGiftDto {
  @IsNotEmpty()
  giftUrl: string;

  @IsNumber()
  giftOrd: number;

  @IsOptional()
  giftOpt: string;

  @IsOptional()
  giftCont: string;
}