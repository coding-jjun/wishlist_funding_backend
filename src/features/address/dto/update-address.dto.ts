import { CreateAddressDto } from './create-address.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateAddressDto {
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
