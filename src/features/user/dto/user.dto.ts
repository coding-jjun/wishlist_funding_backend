import { AuthType } from "src/enums/auth-type.enum";

export class UserDto {
  constructor(
    public userNick: string,
    public userName: string,
    public userPhone: string,
    public userBirth: Date,
    public authType: AuthType,
    public userImg: string,
    public userId: number,
    public userEmail?: string,
    public authId?: string,
  ) {}
}