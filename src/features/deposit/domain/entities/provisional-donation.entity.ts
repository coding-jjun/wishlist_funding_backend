import { Funding } from 'src/entities/funding.entity';
import { User } from 'src/entities/user.entity';
import { ProvisionalDonationStatus } from 'src/enums/provisional-donation-status.enum';

/**
 * TODO - 현재 PoC를 위한 엔티티입니다. `@Entity` 데코레이터를 나중에 등록해야 합니다.
 */
export class ProvisionalDonation {
  constructor(
    public readonly id: string,
    public readonly senderSig: string, // '홍길동-1234'
    public readonly senderUser: User, // User('홍길동')
    public readonly amount: number,
    public readonly funding: Funding,
    public status: ProvisionalDonationStatus = ProvisionalDonationStatus.Pending,
  ) {}

  approve(): void {
    this.status = ProvisionalDonationStatus.Approved;
  }

  reject(): void {
    this.status = ProvisionalDonationStatus.Rejected;
  }
}
