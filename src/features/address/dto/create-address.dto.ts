import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { LargeNumberLike } from 'crypto';

export class CreateAddressDto {

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

  @IsOptional()
  recvReq: string;

  @IsNotEmpty()
  isDef: boolean;
}
