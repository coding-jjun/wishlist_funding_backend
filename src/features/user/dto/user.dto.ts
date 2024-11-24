import { AuthType } from "src/enums/auth-type.enum";
import { BankType } from "src/enums/bank-type.enum";

export class UserDto {
  constructor(
    public userNick: string,
    public userName: string,
    public userPhone: string,
    public userBirth: Date,
    public authType: AuthType,
    public userImg: string,
    public userId: number,
    public isAdmin: boolean,
    public userEmail?: string,
    public authId?: string,
    public bank?: BankType,
    public accNum?: string,
  ) {}
}