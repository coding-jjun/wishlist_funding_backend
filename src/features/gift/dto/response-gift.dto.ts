import { Gift } from "src/entities/gift.entity";

export class ResponseGiftDto {
  giftId: number;
  fundId: number; // funding 객체 대신 fundId만 포함
  giftUrl: string;
  giftOrd: number;
  giftOpt: string;
  giftCont: string;

  constructor(gift: Gift) {
    this.giftId = gift.giftId;
    this.fundId = gift.funding.fundId;
    this.giftUrl = gift.giftUrl;
    this.giftOrd = gift.giftOrd;
    this.giftOpt = gift.giftOpt;
    this.giftCont = gift.giftCont;
  }
}