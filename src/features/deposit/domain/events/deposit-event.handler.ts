import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DepositMatchedEvent } from './deposit-matched.event';
import { DepositPartiallyMatchedEvent } from './deposit-partially-matched.event';
import { DepositUnmatchedEvent } from './deposit-unmatched.event';
import { NotificationService } from 'src/features/notification/notification.service';
import { CreateNotificationDto } from 'src/features/notification/dto/create-notification.dto';
import { NotiType } from 'src/enums/noti-type.enum';
import { CreateDonationUseCase } from 'src/features/donation/commands/create-donation.usecase';
import { CreateDonationCommand } from 'src/features/donation/commands/create-donation.command';
import { IncreaseFundSumUseCase } from 'src/features/funding/commands/increase-fundsum.usecase';
import { IncreaseFundSumCommand } from 'src/features/funding/commands/increase-fundsum.command';

@Injectable()
export class DepositEventHandler {
  constructor(
    private readonly createDonation: CreateDonationUseCase,
    private readonly increaseFundSum: IncreaseFundSumUseCase,
    private readonly notiService: NotificationService,
  ) {}

  /**
   * 1. 정식 후원 내역에 한 건 추가합니다.
   * 2. 펀딩의 달성 금액이 업데이트 됩니다 `Funding.fundSum`
   * 3. 후원자에게 알림을 보냅니다. `DonationSucessNotification`
   * 4. 펀딩주인에게 알림을 보냅니다. `NewDonate`
   */
  @OnEvent('deposit.matched')
  handleDepositMatched(event: DepositMatchedEvent) {
    const { deposit, provisionalDonation } = event;
    const { funding, senderUser } = provisionalDonation;
    // 1
    this.createDonation.execute(
      new CreateDonationCommand(funding, deposit.amount, senderUser),
    );

    // 2
    this.increaseFundSum.execute(
      new IncreaseFundSumCommand(funding, deposit.amount),
    );

    // 3
    const createNotificationDtoForSender = new CreateNotificationDto({
      recvId: senderUser.userId,
      sendId: undefined,
      notiType: NotiType.DonationSuccess,
      subId: funding.fundUuid,
    });
    this.notiService.createNoti(createNotificationDtoForSender);

    // 4
    const createNotificationDtoForReceiver = new CreateNotificationDto({
      recvId: funding.fundUser.userId,
      sendId: provisionalDonation.senderUser.userId,
      notiType: NotiType.NewDonate,
      subId: funding.fundUuid,
    });
    this.notiService.createNoti(createNotificationDtoForReceiver);
  }

  @OnEvent('deposit.partiallyMatched')
  handleDepositPartiallyMatched(event: DepositPartiallyMatchedEvent) {}

  @OnEvent('deposit.unmatched')
  handleDepositUnmatched(event: DepositUnmatchedEvent) {}
}
