import { MatchDepositUseCase } from './match-deposit.usecase';
import { InMemoryProvisionalDonationRepository } from '../infrastructure/repositories/in-memory-provisional-donation.repository';
import { Deposit } from '../domain/entities/deposit.entity';
import { ProvisionalDonation } from '../domain/entities/provisional-donation.entity';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { DepositMatchedEvent } from '../domain/events/deposit-matched.event';
import { DepositUnmatchedEvent } from '../domain/events/deposit-unmatched.event';
import { DepositPartiallyMatchedEvent } from '../domain/events/deposit-partially-matched.event';
import { GiftogetherExceptions } from '../../../filters/giftogether-exception';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/entities/user.entity';
import { ImageType } from 'src/enums/image-type.enum';
import { AuthType } from 'src/enums/auth-type.enum';
import { Funding } from 'src/entities/funding.entity';
import { FundTheme } from 'src/enums/fund-theme.enum';
import { ProvisionalDonationStatus } from 'src/enums/provisional-donation-status.enum';

describe('MatchDepositUseCase', () => {
  let donationRepository: InMemoryProvisionalDonationRepository;
  let matchDepositUseCase: MatchDepositUseCase;
  let eventEmitter: EventEmitter2;
  let g2gException: GiftogetherExceptions;

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
    g2gException = module.get(GiftogetherExceptions);

    const mockUser1: User = {
      imgSubId: 1,
      imageType: ImageType.User,
      userId: 1,
      authId: 'mockUser',
      authType: AuthType.Jwt,
      userNick: 'mockUser',
      userPw: 'password',
      userName: '홍길동',
      userPhone: '010-1234-5678',
      userBirth: new Date('1997-09-26'),
      account: null,
      regAt: new Date(Date.now()),
      uptAt: new Date(Date.now()),
      delAt: null,
      fundings: [],
      comments: [],
      addresses: [],
      userEmail: 'mockuser@example.com',
      user: null,
      defaultImgId: undefined,
      createdImages: [],
      image: null,
      isAdmin: false,
    };

    const mockUser2 = Object.create(mockUser1);
    mockUser2.userName = '김철수';

    const mockUser3 = Object.create(mockUser1);
    mockUser3.userName = '이영희';

    const mockFunding: Funding = {
      fundUser: undefined,
      fundTitle: 'mockFunding',
      fundCont: 'mockFunding',
      fundGoal: 1000000,
      endAt: new Date('9999-12-31'),
      fundTheme: FundTheme.Birthday,
      imgSubId: 0,
      imageType: ImageType.Funding,
      fundId: 0,
      fundUuid: 'mockFunding',
      fundPubl: false,
      fundSum: 0,
      fundAddrRoad: '',
      fundAddrDetl: '',
      fundAddrZip: '',
      fundRecvName: '',
      fundRecvPhone: '',
      fundRecvReq: '',
      regAt: new Date(Date.now()),
      uptAt: new Date(Date.now()),
      comments: [],
      gifts: [],
      donations: [],
      image: undefined,
    };

    jest.spyOn(eventEmitter, 'emit'); // Spy on the `emit` method for assertions.

    // Seed sample donations
    donationRepository.save(
      new ProvisionalDonation(
        '1',
        '홍길동-1234',
        mockUser1,
        50000,
        mockFunding,
      ),
    );
    donationRepository.save(
      new ProvisionalDonation(
        '2',
        '김철수-5678',
        mockUser2,
        100000,
        mockFunding,
      ),
    );
    donationRepository.save(
      new ProvisionalDonation(
        '3',
        '이영희-9012',
        mockUser3,
        150000,
        mockFunding,
      ),
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
      deposit.senderSig,
      deposit.amount,
    );

    expect(matchedSponsorship?.status).toBe(ProvisionalDonationStatus.Approved);
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
    expect(() => matchDepositUseCase.execute(deposit)).toThrow(
      g2gException.DepositPartiallyMatched,
    );

    // Assert
    const sponsorship = donationRepository.findBySenderAndAmount(
      deposit.senderSig,
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
    expect(() => matchDepositUseCase.execute(deposit)).toThrow(
      g2gException.DepositUnmatched,
    );

    // Assert
    const sponsorship = donationRepository.findBySenderAndAmount(
      deposit.senderSig,
      deposit.amount,
    );

    expect(sponsorship).toBeUndefined(); // No match found
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      'deposit.unmatched',
      expect.any(DepositUnmatchedEvent),
    );
  });
});
