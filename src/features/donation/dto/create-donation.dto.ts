import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsUrl,
} from 'class-validator';
import { CreateGuestDto } from './create-guest.dto';

export class CreateDonationDto {
  @IsOptional()
  guest: CreateGuestDto;

  @IsNumber()
  donAmnt: number;

  @IsOptional()
  @IsString()
  rollMsg: string;

  /*
   * fundImg와 defaultImgId 둘 중에 하나만 null이어야 함
   */
  @IsOptional()
  @IsUrl()
  rollImg: string;

  /*
   * fundImg와 defaultImgId 둘 중에 하나만 null이어야 함
   */
  @IsOptional()
  @IsNumber()
  defaultImgId?: number;
}
