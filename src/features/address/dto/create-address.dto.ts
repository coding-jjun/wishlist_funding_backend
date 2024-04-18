import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator'
import { LargeNumberLike } from 'crypto';

export class CreateAddressDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  addrRoad: string;

  @IsNotEmpty()
  addrDetl: string;

  @IsNotEmpty()
  addrZip: number;

  @IsOptional()
  addrNick: string;

  @IsNotEmpty()
  isDef: boolean;
}
