import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DepositMatchedEvent } from './deposit-matched.event';
import { DepositPartiallyMatchedEvent } from './deposit-partially-matched.event';
import { DepositUnmatchedEvent } from './deposit-unmatched.event';

@Injectable()
export class DepositEventHandler {
  @OnEvent('deposit.matched')
  handleDepositMatched(event: DepositMatchedEvent) {}

  @OnEvent('deposit.partiallyMatched')
  handleDepositPartiallyMatched(event: DepositPartiallyMatchedEvent) {}

  @OnEvent('deposit.unmatched')
  handleDepositUnmatched(event: DepositUnmatchedEvent) {}
}
