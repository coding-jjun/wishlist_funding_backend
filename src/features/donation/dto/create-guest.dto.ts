import { IsNotEmpty } from 'class-validator';
import { BankType } from 'src/enums/bank-type.enum';

export class CreateGuestDto {
  @IsNotEmpty()
  userNick: string;

  @IsNotEmpty()
  userPhone: string;

  @IsNotEmpty()
  accBank: BankType;

  @IsNotEmpty()
  accNum: string;
}
