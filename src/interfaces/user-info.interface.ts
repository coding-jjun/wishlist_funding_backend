import { AuthType } from 'src/enums/auth-type.enum';

export interface UserInfo {
  authId: string;

  authType: AuthType;

  userNick?: string;

  userName?: string | null;

  userPhone?: string | null;

  userEmail: string;

  userBirth?: Date | null;

  /*
   * fundImg와 defaultImgId 둘 중에 하나만 null이어야 함
   */
  userImg?: string | null;

  userAcc?:number  | null;

  /*
   * fundImg와 defaultImgId 둘 중에 하나만 null이어야 함
   */
  defaultImgId?: number;
}
