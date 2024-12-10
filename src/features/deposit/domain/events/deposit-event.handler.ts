import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DepositMatchedEvent } from './deposit-matched.event';
import { DepositPartiallyMatchedEvent } from './deposit-partially-matched.event';
import { DepositUnmatchedEvent } from './deposit-unmatched.event';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { InMemoryDonationRepository } from 'src/features/donation/infrastructure/repositories/in-memory-donation.repository';
import { FundingService } from 'src/features/funding/funding.service';

@Injectable()
export class DepositEventHandler {
  constructor(
    private readonly g2gException: GiftogetherExceptions,
    private readonly donationRepository: InMemoryDonationRepository,
    private readonly fundingService: FundingService,
  ) {}

  /**
   * 1. 정식 후원 내역에 한 건 추가합니다.
   * 2. 펀딩의 달성 금액이 업데이트 됩니다 `Funding.fundSum`
   * 3. 후원자에게 알림을 보냅니다. `DonationSucessNotification`
   */
  @OnEvent('deposit.matched')
  handleDepositMatched(event: DepositMatchedEvent) {
    // this.donationRepository.create();
  }

  @OnEvent('deposit.partiallyMatched')
  handleDepositPartiallyMatched(event: DepositPartiallyMatchedEvent) {}

  @OnEvent('deposit.unmatched')
  handleDepositUnmatched(event: DepositUnmatchedEvent) {}
}
