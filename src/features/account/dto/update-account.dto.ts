import { IsNotEmpty } from "class-validator";
import { BankType } from "src/enums/bank-type.enum";

export class UpdateAccountDto {
  @IsNotEmpty()
  bank: BankType;
  
  @IsNotEmpty()
  accNum: string;
}