import { Test, TestingModule } from '@nestjs/testing';
import { FundingController } from './funding.controller';

describe('FundingController', () => {
  let controller: FundingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FundingController],
    }).compile();

    controller = module.get<FundingController>(FundingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
