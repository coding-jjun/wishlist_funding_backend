import { Address } from "src/entities/address.entity";

export class AddressDto {
  addrId: number;
  userId: number;
  addrNick: string;
  addrRoad: string;
  addrDetl: string;
  addrZip: string;
  recvName: string;
  recvPhone: string;
  isDef: boolean;

  constructor(address: Address) {
    this.addrId = address.addrId;
    this.userId = address.addrUser.userId;
    this.addrNick = address.addrNick;
    this.addrRoad = address.addrRoad;
    this.addrDetl = address.addrDetl;
    this.addrZip = address.addrZip;
    this.recvName = address.recvName;
    this.recvPhone = address.recvPhone;
    this.isDef = address.isDef;
  }
}