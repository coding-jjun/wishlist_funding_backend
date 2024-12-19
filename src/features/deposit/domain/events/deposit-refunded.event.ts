import { Deposit } from '../entities/deposit.entity';

export class DepositUnmatchedRefundedEvent {
  constructor(public readonly deposit: Deposit) {}
}
