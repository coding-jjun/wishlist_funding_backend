import { Donation } from 'src/entities/donation.entity';
import { DonationStatus } from 'src/enums/donation-status.enum';

export class DonationListDto {
  donId: number;
  donUserId: number;
  donUserNick: string;
  donUserImg: string;
  orderId: string;
  donStat: DonationStatus;
  donAmnt: number;
  regAt: Date;

  constructor(donation: Donation) {
    this.donId = donation.donId;
    this.donUserId = donation.user.userId;
    this.donUserNick = donation.user.userNick;
    this.donUserImg = donation.user.image ? donation.user.image.imgUrl : '';
    this.orderId = donation.orderId;
    this.donStat = donation.donStat;
    this.donAmnt = donation.donAmnt;
    this.regAt = donation.regAt;
  }
}
