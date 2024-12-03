import { Injectable } from '@nestjs/common';
import { InMemoryProvisionalDonationRepository } from '../../infrastructure/repositories/in-memory-provisional-donation.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DepositMatchedEvent } from '../../domain/events/deposit-matched.event';
import { DepositUnmatchedEvent } from '../../domain/events/deposit-unmatched.event';
import { Deposit } from '../../domain/entities/deposit.entity';

@Injectable()
export class MatchDepositUseCase {
  constructor(
    private readonly donationRepository: InMemoryProvisionalDonationRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  execute(deposit: Deposit): void {
    const donation = this.donationRepository.findBySenderAndAmount(
      deposit.sender,
      deposit.amount,
    );

    if (donation) {
      donation.approve();
      this.eventEmitter.emit(
        'deposit.matched',
        new DepositMatchedEvent(deposit, donation.id),
      );
    } else {
      this.eventEmitter.emit(
        'deposit.unmatched',
        new DepositUnmatchedEvent(deposit),
      );
    }
  }
}
