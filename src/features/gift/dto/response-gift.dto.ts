import { Gift } from 'src/entities/gift.entity';

export class ResponseGiftDto {
  giftId: number;
  fundId: number; // funding 객체 대신 fundId만 포함
  giftUrl: string;
  giftTitle: string;
  giftOrd: number;
  giftOpt: string;
  giftCont: string;
  giftImg: string;

  constructor(gift: Gift, url: string) {
    this.giftId = gift.giftId;
    this.fundId = gift.funding.fundId;
    this.giftUrl = gift.giftUrl;
    this.giftTitle = gift.giftTitle;
    this.giftOrd = gift.giftOrd;
    this.giftOpt = gift.giftOpt;
    this.giftCont = gift.giftCont;
    this.giftImg = url;
  }
}
