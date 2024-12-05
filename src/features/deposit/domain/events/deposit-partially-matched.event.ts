import { Deposit } from 'src/features/deposit/domain/entities/deposit.entity';

export class DepositPartiallyMatchedEvent {
  constructor(public readonly deposit: Deposit) {}
}
