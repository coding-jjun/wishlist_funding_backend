import { IsNotEmpty, IsOptional, IsString, IsNumber, IsUrl } from 'class-validator';
import { CreateGuestDto } from './create-guest.dto';

export class CreateDonationDto {
  @IsOptional()
  guest: CreateGuestDto;

  @IsNumber()
  donAmnt: number;

  @IsOptional()
  @IsString()
  rollMsg: string;

  @IsOptional()
  @IsUrl()
  rollImg: string;
}
