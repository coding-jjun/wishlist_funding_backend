import { AuthType } from 'src/enums/auth-type.enum';

export interface UserInfo {
  authId: string;

  authType: AuthType;

  userNick?: string;

  userName?: string | null;

  userPhone?: string | null;

  userEmail: string;

  userBirth?: Date | null;

  userImg?: string | null;

  userAcc?:number  | null;

  defaultImgId?: number;
}
