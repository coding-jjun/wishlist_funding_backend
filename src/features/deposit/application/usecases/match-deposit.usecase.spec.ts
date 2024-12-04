import { MatchDepositUseCase } from './match-deposit.usecase';
import { InMemoryProvisionalDonationRepository } from '../../infrastructure/repositories/in-memory-provisional-donation.repository';
import { Deposit } from '../../domain/entities/deposit.entity';
import { ProvisionalDonation } from '../../domain/entities/provisional-donation.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DepositMatchedEvent } from '../../domain/events/deposit-matched.event';
import { DepositUnmatchedEvent } from '../../domain/events/deposit-unmatched.event';

describe('MatchDepositUseCase', () => {
  let donationRepository: InMemoryProvisionalDonationRepository;
  let matchDepositUseCase: MatchDepositUseCase;
  let eventEmitter: EventEmitter2;

  beforeEach(() => {
    // Mock EventEmitter2
    eventEmitter = new EventEmitter2();
    jest.spyOn(eventEmitter, 'emit'); // Spy on the `emit` method for assertions.

    // Initialize repository and use case
    donationRepository = new InMemoryProvisionalDonationRepository();
    matchDepositUseCase = new MatchDepositUseCase(
      donationRepository,
      eventEmitter,
    );

    // Seed sample donations
    donationRepository.save(
      new ProvisionalDonation('1', '홍길동-1234', 50000, 'PENDING'),
    );
    donationRepository.save(
      new ProvisionalDonation('2', '김철수-5678', 100000, 'PENDING'),
    );
    donationRepository.save(
      new ProvisionalDonation('3', '이영희-9012', 150000, 'PENDING'),
    );
  });

  it('should match deposit with an exact sponsorship (Matched Case)', () => {
    // Arrange
    const deposit = new Deposit(
      '홍길동-1234',
      'Receiver Name',
      50000,
      new Date(),
      'Bank Name',
      'Deposit Account',
      'Withdrawal Account',
    );

    // Act
    matchDepositUseCase.execute(deposit);

    // Assert
    const matchedSponsorship = donationRepository.findBySenderAndAmount(
      deposit.sender,
      deposit.amount,
    );

    expect(matchedSponsorship?.status).toBe('APPROVED');
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      'deposit.matched',
      expect.any(DepositMatchedEvent),
    );
  });

  it('should handle partial match (Partially Matched Case)', () => {
    // Arrange
    const deposit = new Deposit(
      '홍길동-1234',
      'Receiver Name',
      40000, // Mismatched amount
      new Date(),
      'Bank Name',
      'Deposit Account',
      'Withdrawal Account',
    );

    // Act
    matchDepositUseCase.execute(deposit);

    // Assert
    const sponsorship = donationRepository.findBySenderAndAmount(
      deposit.sender,
      deposit.amount,
    );

    expect(sponsorship).toBeUndefined(); // No exact match found
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      'deposit.unmatched',
      expect.any(DepositUnmatchedEvent),
    );
  });

  it('should handle unmatched deposit (Unmatched Case)', () => {
    // Arrange
    const deposit = new Deposit(
      '박영수-9999', // Non-existent sender
      'Receiver Name',
      50000,
      new Date(),
      'Bank Name',
      'Deposit Account',
      'Withdrawal Account',
    );

    // Act
    matchDepositUseCase.execute(deposit);

    // Assert
    const sponsorship = donationRepository.findBySenderAndAmount(
      deposit.sender,
      deposit.amount,
    );

    expect(sponsorship).toBeUndefined(); // No match found
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      'deposit.unmatched',
      expect.any(DepositUnmatchedEvent),
    );
  });
});
