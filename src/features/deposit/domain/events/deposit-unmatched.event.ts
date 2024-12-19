import { Deposit } from 'src/features/deposit/domain/entities/deposit.entity';
import { ProvisionalDonation } from '../entities/provisional-donation.entity';

export class DepositUnmatchedEvent {
  constructor(
    public readonly deposit: Deposit,
    public readonly provisionalDonation: ProvisionalDonation,
  ) {}
}
