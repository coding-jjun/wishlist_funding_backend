import { Test, TestingModule } from '@nestjs/testing';
import { DepositEventHandler } from './deposit-event.handler';
import { DepositMatchedEvent } from './deposit-matched.event';
import { NotificationService } from 'src/features/notification/notification.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
import { CreateDonationUseCase } from 'src/features/donation/commands/create-donation.usecase';
import { IncreaseFundSumUseCase } from 'src/features/funding/commands/increase-fundsum.usecase';
import { GetDonationsByFundingUseCase } from 'src/features/donation/queries/get-donations-by-funding.usecase';
import { Provider } from '@nestjs/common';
import { createMockRepository } from '../../../../tests/create-mock-repository';

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
  let notificationService: NotificationService;
  let fundingOwner: User;
  let matchedDonor: User;
  let partiallyMatchedDonor: User;
  let unmatchedDonator: User;
  let mockFunding: Funding;
  let createDonation: CreateDonationUseCase;
  let increaseFundSum: IncreaseFundSumUseCase;

  beforeEach(async () => {
    // TODO - move test module options into nice place
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepositEventHandler,
        NotificationService,
        GiftogetherExceptions,
        CreateDonationUseCase,
        IncreaseFundSumUseCase,
        GetDonationsByFundingUseCase,
        /**
         * 아래 프로바이더들은 Repository<Entity>를 모킹하기 위해
         * 사용됩니다. 즉, 단위테스트를 위해 실제 RDS에 데이터를 저장하는
         * 것이 아닌, MockRepository에 호출만 합니다.
         *
         * 만약 실제로 데이터를 넣고 그 결과를 재가공해야 할 필요가 있다면
         * 아래 두가지 방법 중 하나를 사용할 수 있습니다:
         *
         * 1. TypeOrmModule을 `imports:`에 추가한다. 테스트 DB에 직접
         *    데이터를 CRUD한다.
         * 2. 사용하고자 하는 메서드만 In Memory에 조작을 가한다.
         */
        ...entities.map(
          (e): Provider => ({
            provide: getRepositoryToken(e),
            useValue: createMockRepository(Repository<typeof e>),
          }),
        ),
      ],
    }).compile();

    handler = module.get(DepositEventHandler);
    notificationService = module.get(NotificationService);
    createDonation = module.get(CreateDonationUseCase);
    increaseFundSum = module.get(IncreaseFundSumUseCase);

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

    const donationSpy = jest.spyOn(createDonation, 'execute');
    const fundingSpy = jest.spyOn(increaseFundSum, 'execute');
    const notiSpy = jest.spyOn(notificationService, 'createNoti');

    await handler.handleDepositMatched(event);

    // Verify donation creation
    expect(donationSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        funding: mockFunding,
        amount: deposit.amount,
        donor: matchedDonor,
      }),
    );

    expect(donationSpy).toHaveBeenCalledTimes(1);

    // Verify funding update
    expect(fundingSpy).toHaveBeenCalledWith(
      expect.objectContaining({ funding: mockFunding, amount: deposit.amount }),
    );

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
