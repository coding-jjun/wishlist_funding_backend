import { IsNotEmpty } from 'class-validator';

export class CreateGuestDto {
  @IsNotEmpty()
  userNick: string;

  @IsNotEmpty()
  userPhone: string;

  @IsNotEmpty()
  accBank: string;

  @IsNotEmpty()
  accNum: string;
}
