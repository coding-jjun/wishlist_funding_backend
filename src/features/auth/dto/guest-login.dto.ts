import { IsNotEmpty, IsString } from "class-validator";

export class GuestLoginDto{
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @IsNotEmpty()
  userPw: string;
}