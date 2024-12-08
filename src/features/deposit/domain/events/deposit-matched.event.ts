import { Deposit } from 'src/features/deposit/domain/entities/deposit.entity';

export class DepositMatchedEvent {
  constructor(
    public readonly deposit: Deposit,
    public readonly donationId: string,
  ) {}
}
