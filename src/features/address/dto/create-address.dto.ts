import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator'
import { LargeNumberLike } from 'crypto';

export class CreateAddressDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  addrRoad: string;

  @IsNotEmpty()
  addrDetl: string;

  @IsNotEmpty()
  addrZip: string;

  @IsOptional()
  addrNick: string;

  @IsNotEmpty()
  isDef: boolean;
}
