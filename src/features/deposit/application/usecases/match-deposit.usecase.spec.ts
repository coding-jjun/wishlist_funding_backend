import { MatchDepositUseCase } from './match-deposit.usecase';
import { InMemoryProvisionalDonationRepository } from '../../infrastructure/repositories/in-memory-provisional-donation.repository';
import { Deposit } from '../../domain/entities/deposit.entity';
import { ProvisionalDonation } from '../../domain/entities/provisional-donation.entity';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { DepositMatchedEvent } from '../../domain/events/deposit-matched.event';
import { DepositUnmatchedEvent } from '../../domain/events/deposit-unmatched.event';
import { DepositPartiallyMatchedEvent } from '../../domain/events/deposit-partially-matched.event';
import { GiftogetherExceptions } from '../../../../filters/giftogether-exception';
import { Test, TestingModule } from '@nestjs/testing';

describe('MatchDepositUseCase', () => {
  let donationRepository: InMemoryProvisionalDonationRepository;
  let matchDepositUseCase: MatchDepositUseCase;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      controllers: [],
      providers: [
        GiftogetherExceptions,
        MatchDepositUseCase,
        InMemoryProvisionalDonationRepository,
      ],
    }).compile();

    matchDepositUseCase = module.get(MatchDepositUseCase);
    donationRepository = module.get(InMemoryProvisionalDonationRepository);
    eventEmitter = module.get(EventEmitter2);

    jest.spyOn(eventEmitter, 'emit'); // Spy on the `emit` method for assertions.

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

  it('should be defined', () => {
    expect(donationRepository).toBeDefined();
    expect(matchDepositUseCase).toBeDefined();
    expect(eventEmitter).toBeDefined();
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
      'deposit.partiallyMatched',
      expect.any(DepositPartiallyMatchedEvent),
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
