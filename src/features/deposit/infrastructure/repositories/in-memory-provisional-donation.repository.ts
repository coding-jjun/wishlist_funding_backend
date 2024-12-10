import { Injectable } from '@nestjs/common';
import { ProvisionalDonation } from '../../domain/entities/provisional-donation.entity';

/**
 * PoC 검증을 위해 RDS에 의존하지 않는 Repository를 만들었습니다.
 */
@Injectable()
export class InMemoryProvisionalDonationRepository {
  private donations: ProvisionalDonation[] = [];
  save(donation: ProvisionalDonation): void {
    this.donations.push(donation);
  }

  findBySenderSig(senderSig: string): ProvisionalDonation[] {
    return this.donations.filter((s) => s.senderSig === senderSig);
  }

  findBySenderAndAmount(
    senderSig: string,
    amount: number,
  ): ProvisionalDonation | undefined {
    return this.donations.find(
      (s) => s.senderSig === senderSig && s.amount === amount,
    );
  }
}
