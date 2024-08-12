import { IsNotEmpty } from "class-validator";
import { BankType } from "src/enums/bank-type.enum";

export class CreateAccountDto {
  @IsNotEmpty()
  bank: BankType;
  
  @IsNotEmpty()
  accNum: string;
}