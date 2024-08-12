import { getNow } from 'src/app.module';
import { Donation } from 'src/entities/donation.entity';
import { DonationStatus } from 'src/enums/donation-status.enum';

export class DonationDto {
  donId: number;
  rollId: number;
  fundUuid: string;
  donUserId: number;
  orderId: string;
  donStat: DonationStatus;
  donAmnt: number;
  regAt: Date;

  constructor(donation: Donation, rollId: number) {
    this.donId = donation.donId;
    this.rollId = rollId
    this.fundUuid = donation.funding.fundUuid;
    this.donUserId = donation.user.userId;
    this.orderId = donation.orderId;
    this.donStat = donation.donStat;
    this.donAmnt = donation.donAmnt;
    this.regAt = donation.regAt;
  }
}
