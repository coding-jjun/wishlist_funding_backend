import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateGiftDto {
  @IsNotEmpty()
  giftUrl: string;

  @IsNumber()
  giftOrd: number;

  @IsOptional()
  giftOpt: string;

  @IsOptional()
  giftCont: string;
}