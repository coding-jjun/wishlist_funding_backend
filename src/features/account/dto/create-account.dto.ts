import { IsNotEmpty, IsNumber } from "class-validator";
import { BankType } from "src/enums/bank-type.enum";

export class CreateAccountDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  bank: BankType;
  
  @IsNotEmpty()
  accNum: string;
}