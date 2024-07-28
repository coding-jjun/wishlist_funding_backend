import { getNow } from 'src/app.module';
import { Donation } from 'src/entities/donation.entity';
import { DonationStatus } from 'src/enums/donation-status.enum';

export class DonationListDto {
  donId: number;
  fundUuid: string;
  fundTitle: string;
  donUserId: number;
  fundUserId: number;
  fundUserNick: string;
  fundUserImg: string;
  orderId: string;
  donStat: DonationStatus;
  donAmnt: number;
  regAt: Date;

  constructor(donation: Donation) {
    this.donId = donation.donId;
    this.fundUuid = donation.funding.fundUuid;
    this.fundTitle = donation.funding.fundTitle;
    this.donUserId = donation.user.userId;
    this.fundUserId = donation.funding.fundUser.userId;
    this.fundUserNick = donation.funding.fundUser.userNick;
    this.fundUserImg = donation.funding.fundUser.image ? donation.funding.fundUser.image.imgUrl : '';
    this.orderId = donation.orderId;
    this.donStat = donation.donStat;
    this.donAmnt = donation.donAmnt;
    this.regAt = donation.regAt;
  }
}
