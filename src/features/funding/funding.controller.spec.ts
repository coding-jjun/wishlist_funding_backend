import { Test } from '@nestjs/testing';
import { FundingController } from './funding.controller';
import { FundingService } from './funding.service';
import { Funding } from '@entities/funding.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@entities/user.entity';
import { Friend } from '@entities/friend.entity';
import { Gift } from '@entities/gift.entity';
import { Comment } from '@entities/comment.entity';
import { Image } from '@entities/image.entity';
import { Notification } from '@entities/notification.entity';
import { GiftService } from '../gift/gift.service';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { FundingTasksService } from './funding.tasks.service';

describe('FundingController', () => {
  let fundingController: FundingController;
  let fundingService: FundingService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([
          Funding,
          User,
          Comment,
          Friend,
          Gift,
          Image,
          Notification,
        ]),
      ],
      controllers: [FundingController],
      providers: [
        FundingService,
        GiftService,
        GiftogetherExceptions,
        FundingTasksService,
      ],
    }).compile();

    fundingService = moduleRef.get<FundingService>(FundingService);
    fundingController = moduleRef.get<FundingController>(FundingController);
  });

  it('should be defined', () => expect(fundingService).toBeDefined());
});
