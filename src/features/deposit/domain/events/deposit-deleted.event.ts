import { Deposit } from '../entities/deposit.entity';

export class DepositUnmatchedDeletedEvent {
  constructor(public readonly deposit: Deposit) {}
}
