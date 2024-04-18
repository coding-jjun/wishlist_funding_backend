import { CreateAddressDto } from './create-address.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateAddressDto {
  @IsNotEmpty()
  addrId: number;

  @IsOptional()
  addrNick: string;

  @IsOptional()
  isDef: boolean;
}
