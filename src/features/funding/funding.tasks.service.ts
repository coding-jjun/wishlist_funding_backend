import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { And, LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import { Funding } from 'src/entities/funding.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/entities/notification.entity';
import { NotiType } from 'src/enums/noti-type.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class FundingTasksService {
  private readonly logger = new Logger(FundingTasksService.name);
  constructor(
    @InjectRepository(Funding)
    private readonly fundingRepo: Repository<Funding>,

    @InjectRepository(Notification)
    private readonly notiRepo: Repository<Notification>,

    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * 매일 자정 마감된 펀딩들에 대하여 FundClose 이벤트를 생성합니다.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleClosedFundings() {
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 딱 하루 지난 펀딩만 가지고 옵니다.
    const closedFundings = await this.fundingRepo.find({
      where: {
        endAt: And(MoreThanOrEqual(yesterday), LessThan(today)),
      },
      relations: {
        fundUser: true,
      },
    });


    for (const f of closedFundings) {
      this.logger.debug(`"${f.fundTitle}" 마감되어 마감 이벤트 발생하겠습니다.`);
      // 내 펀딩 마감 이벤트 발생
      this.eventEmitter.emit('FundClose', f.fundId);
    }
  }
}
