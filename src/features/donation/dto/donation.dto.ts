import { getNow } from 'src/app.module';
import { Donation } from 'src/entities/donation.entity';
import { DonationStatus } from 'src/enums/donation-status.enum';

export class DonationDto {
  donId: number;
  rollId: number;
  fundId: number;
  fundTitle?: string;
  fundEnd: boolean;
  donUserId: number;
  donUserNick: string;
  orderId: string;
  donStat: DonationStatus;
  regAt: Date;

  constructor(donation: Donation, rollId?: number) {
    this.donId = donation.donId;
    this.rollId = rollId ? rollId : donation.donId;
    this.fundId = donation.funding.fundId;
    this.fundTitle = donation.funding.fundTitle;
    this.fundEnd = (donation.funding.endAt <= new Date(getNow())) ? true : false;
    this.donUserId = donation.user.userId;
    this.donUserNick = donation.user.userNick;
    this.orderId = donation.orderId;
    this.donStat = donation.donStat;
    this.regAt = donation.regAt;
  }
}
