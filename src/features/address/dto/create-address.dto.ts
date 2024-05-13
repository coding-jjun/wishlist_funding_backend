import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator'
import { LargeNumberLike } from 'crypto';

export class CreateAddressDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  addrNick: string;

  @IsNotEmpty()
  addrRoad: string;

  @IsNotEmpty()
  addrDetl: string;

  @IsNotEmpty()
  addrZip: string;
  
  @IsOptional()
  recvName: string;

  @IsOptional()
  recvPhone: string;

  @IsNotEmpty()
  isDef: boolean;
}
