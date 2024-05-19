import { Donation } from 'src/entities/donation.entity';
import { User } from 'src/entities/user.entity';
import { DonationStatus } from 'src/enums/donation-status.enum';

export class ResponseDonationDTO {
  donator: User;

  rollId: number;

  donId: number;

  orderId: string;

  donationStatus: DonationStatus;

  regAt: Date;

  constructor(donation: Donation, rollId: number) {
    this.donator = donation.user;
    this.rollId = rollId;
    this.donId = donation.donId;
    this.orderId = donation.orderId;
    this.donationStatus = donation.donationStatus;
    this.regAt = donation.regAt;
  }
}
