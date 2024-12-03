import { Test, TestingModule } from '@nestjs/testing';
import { DepositController } from './deposit.controller';
import { DepositService } from './deposit.service';
import { UploadDepositUseCase } from './application/usecases/upload-deposit.usecase';
import { MatchDepositUseCase } from './application/usecases/match-deposit.usecase';
import { InMemoryDepositRepository } from './infrastructure/repositories/in-memory-deposit.repository';
import { InMemoryProvisionalDonationRepository } from './infrastructure/repositories/in-memory-provisional-donation.repository';
import { EventEmitterModule } from '@nestjs/event-emitter';

describe('DepositController', () => {
  let controller: DepositController;
  let service: DepositService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      controllers: [DepositController],
      providers: [
        DepositService,
        UploadDepositUseCase,
        MatchDepositUseCase,
        InMemoryDepositRepository,
        InMemoryProvisionalDonationRepository,
      ],
    }).compile();

    controller = module.get<DepositController>(DepositController);
    service = module.get<DepositService>(DepositService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });
});
