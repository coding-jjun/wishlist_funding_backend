import { IsNotEmpty, IsNumber } from "class-validator";
import { BankType } from "@enums/bank-type.enum";

export class UpdateAccountDto {
  @IsNotEmpty()
  bank: BankType;
  
  @IsNotEmpty()
  accNum: string;
}