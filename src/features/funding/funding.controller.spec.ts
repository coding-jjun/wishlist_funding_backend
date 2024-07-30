import { Test } from '@nestjs/testing';
import { FundingController } from './funding.controller';
import { FundingService } from './funding.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment } from '@entities/comment.entity';
import { GiftService } from '../gift/gift.service';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { FundingTasksService } from './funding.tasks.service';
import { Repository } from 'typeorm';
import { Funding } from '@entities/funding.entity';
import { User } from '@entities/user.entity';
import { Friend } from '@entities/friend.entity';
import { Image } from '@entities/image.entity';
import { Gift } from '@entities/gift.entity';
import { Notification } from '@entities/notification.entity';

const mockRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  softDelete: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('FundingController', () => {
  let fundingController: FundingController;
  let fundingService: FundingService;
  let commentRepository: MockRepository<Comment>;
  let fundingRepository: MockRepository<Funding>;
  let userRepository: MockRepository<User>;
  let friendRepository: MockRepository<Friend>;
  let imageRepository: MockRepository<Image>;
  let giftRepository: MockRepository<Gift>;
  let notificationRepository: MockRepository<Notification>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [FundingController],
      providers: [
        FundingService,
        GiftService,
        GiftogetherExceptions,
        {
          provide: getRepositoryToken(Comment),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Funding),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Friend),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Image),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Gift),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Notification),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    fundingService = moduleRef.get<FundingService>(FundingService);
    fundingController = moduleRef.get<FundingController>(FundingController);
    commentRepository = moduleRef.get<MockRepository<Comment>>(
      getRepositoryToken(Comment),
    );
    fundingRepository = moduleRef.get<MockRepository<Funding>>(
      getRepositoryToken(Funding),
    );
    userRepository = moduleRef.get<MockRepository<User>>(
      getRepositoryToken(User),
    );
    friendRepository = moduleRef.get<MockRepository<Friend>>(
      getRepositoryToken(Friend),
    );
    imageRepository = moduleRef.get<MockRepository<Image>>(
      getRepositoryToken(Image),
    );
    giftRepository = moduleRef.get<MockRepository<Gift>>(
      getRepositoryToken(Gift),
    );
    notificationRepository = moduleRef.get<MockRepository<Notification>>(
      getRepositoryToken(Notification),
    );
  });

  it('should be defined', () => expect(fundingController).toBeDefined());
});
