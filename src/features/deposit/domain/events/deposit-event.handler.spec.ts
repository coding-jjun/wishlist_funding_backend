import { Test, TestingModule } from '@nestjs/testing';
import { DepositEventHandler } from './deposit-event.handler';
import { DepositMatchedEvent } from './deposit-matched.event';
import { FundingRepository } from 'src/features/funding/infrastructure/repositories/funding.repository';
import { NotificationService } from 'src/features/notification/notification.service';
import { InMemoryDonationRepository } from 'src/features/donation/infrastructure/repositories/in-memory-donation.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Funding } from 'src/entities/funding.entity';
import { Donation } from 'src/entities/donation.entity';
import { Notification } from 'src/entities/notification.entity';
import { Deposit } from '../entities/deposit.entity';
import { ProvisionalDonation } from '../entities/provisional-donation.entity';
import { ImageType } from 'src/enums/image-type.enum';
import { AuthType } from 'src/enums/auth-type.enum';
import { FundTheme } from 'src/enums/fund-theme.enum';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { Account } from 'src/entities/account.entity';
import { Comment } from 'src/entities/comment.entity';
import { Address } from 'src/entities/address.entity';
import { Image } from 'src/entities/image.entity';
import { Gift } from 'src/entities/gift.entity';
import { readFileSync } from 'fs';

// TODO - move test module options into nice place
const entities = [
  User,
  Account,
  Comment,
  Address,
  Image,
  Funding,
  Gift,
  Donation,
  Notification,
];

// TODO - move test module options into nice place
const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 5432,
  password: process.env.DB_TEST_PASSWORD,
  username: process.env.DB_TEST_USERNAME,
  database: process.env.DB_TEST_DATABASE,
  synchronize: true,
  logging: false,
  dropSchema: true,
  ssl: {
    ca: readFileSync('global-bundle.pem'),
  },
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
};

/**
 * ## 전제조건
 *
 * 샘플 펀딩이 하나 만들어져있고 세 명의 유저가 각각
 * matched, partially matched, unmatched 한 상황을 만들었다.
 *
 * ## Assumes
 *
 * match-deposit.usecase.spec.ts가 전부 통과한다고 가정.
 */
describe('DepositEventHandler', () => {
  let handler: DepositEventHandler;
  let fundingRepository: FundingRepository;
  let notificationService: NotificationService;
  let donationRepository: InMemoryDonationRepository;
  let fundingOwner: User;
  let matchedDonor: User;
  let partiallyMatchedDonor: User;
  let unmatchedDonator: User;
  let mockFunding: Funding;

  beforeEach(async () => {
    // TODO - move test module options into nice place
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({ ...dataSourceOptions, autoLoadEntities: true }),
        TypeOrmModule.forFeature(entities),
      ],
      providers: [
        DepositEventHandler,
        FundingRepository,
        NotificationService,
        InMemoryDonationRepository,
        GiftogetherExceptions,
      ],
    }).compile();

    handler = module.get(DepositEventHandler);
    fundingRepository = module.get(FundingRepository);
    notificationService = module.get(NotificationService);
    donationRepository = module.get<InMemoryDonationRepository>(
      InMemoryDonationRepository,
    );

    // TODO - call mock factory
    fundingOwner = {
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

    // TODO - call mock factory
    mockFunding = {
      fundUser: fundingOwner,
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

    matchedDonor = Object.create(fundingOwner);
    matchedDonor.userName = '일치하는 금액을 넣은 착한 후원자';

    partiallyMatchedDonor = Object.create(fundingOwner);
    partiallyMatchedDonor.userName = '실수로 0 하나를 더 써넣은 천사 후원자';

    unmatchedDonator = Object.create(fundingOwner);
    unmatchedDonator.userName =
      '실수로 보내는 분에 실명을 적어넣은 순진한 후원자';
  });

  it('should be defined', () => {
    expect(process.env.DB_HOST).toBeDefined();
    expect(process.env.DB_TEST_DATABASE).toBeDefined();
    expect(process.env.DB_TEST_PASSWORD).toBeDefined();
    expect(process.env.DB_TEST_USERNAME).toBeDefined();
  });

  it('should handle deposit.matched event', async () => {
    const deposit = new Deposit(
      'sender',
      'receiver',
      1000,
      new Date(),
      'depositBank',
      'depositAccount',
      'withdrawalAccount',
    );

    const provisionalDonation = new ProvisionalDonation(
      '1',
      matchedDonor.userName + '-1234',
      matchedDonor,
      1000,
      mockFunding,
    );
    const event = new DepositMatchedEvent(deposit, provisionalDonation);

    const donationSpy = jest.spyOn(donationRepository, 'create');
    const fundingSpy = jest.spyOn(fundingRepository, 'increasefundSum');
    const notiSpy = jest.spyOn(notificationService, 'createNoti');

    await handler.handleDepositMatched(event);

    // Verify donation creation
    expect(donationSpy).toHaveBeenCalledWith(
      mockFunding,
      expect.objectContaining({ donAmnt: deposit.amount }),
      matchedDonor,
    );

    // Verify funding update
    expect(fundingSpy).toHaveBeenCalledWith(mockFunding, deposit.amount);

    // Verify notifications
    expect(notiSpy).toHaveBeenCalledTimes(2);

    // 후원자에게 알림이 정상적으로 보내졌습니다
    expect(notiSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        recvId: matchedDonor.userId,
        notiType: 'DonationSuccess',
        subId: mockFunding.fundUuid,
      }),
    );

    // 펀딩 주인에게 알림이 정상적으로 보내졌습니다
    expect(notiSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        recvId: fundingOwner.userId,
        sendId: matchedDonor.userId,
        notiType: 'NewDonate',
        subId: mockFunding.fundUuid,
      }),
    );
  });
});
