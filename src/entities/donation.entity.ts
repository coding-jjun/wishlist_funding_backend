import { DonationStatus } from 'src/enums/donation-status.enum';
import { Funding } from 'src/entities/funding.entity';
import { User } from 'src/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  OneToOne,
} from 'typeorm';
import { IsInt, Min } from 'class-validator';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { Deposit } from 'src/features/deposit/domain/entities/deposit.entity';
import { InconsistentAggregationError } from 'src/exceptions/inconsistent-aggregation';

@Entity()
export class Donation {
  @PrimaryGeneratedColumn()
  donId: number;

  @ManyToOne(() => Funding)
  @JoinColumn({ name: 'fundId', referencedColumnName: 'fundId' })
  funding: Funding;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
  user: User;

  @OneToOne(() => Deposit, {
    nullable: false, // Donation은 있는데 Deposit이 없는 케이스는 존재하지 않습니다.,
  })
  @JoinColumn({ name: 'depositId', referencedColumnName: 'donation' })
  deposit: Deposit;

  @Column({
    type: 'enum',
    enum: DonationStatus,
    default: DonationStatus.Donated,
  })
  donStat: DonationStatus;

  @Column()
  orderId: string;

  @IsInt()
  @Min(0)
  @Column({ default: 0 })
  donAmnt: number;

  @CreateDateColumn()
  regAt: Date;

  @DeleteDateColumn()
  delAt: Date;

  /**
   * 비록 fundSum이라는 프로퍼티로 엮여있지만, Donation과 Funding과는
   * 즉각적인 일관성이 필요하지 않습니다. 따라서, Donation 삭제시 일관적인
   * 상태인지만 확인하고 softDelete를 수행합니다.
   */
  delete() {
    if (
      [
        DonationStatus.WaitingRefund,
        DonationStatus.RefundComplete,
        DonationStatus.Deleted,
      ].includes(this.donStat)
    ) {
      throw new InconsistentAggregationError();
    }
    this.donStat = DonationStatus.Deleted;
    this.delAt = new Date(Date.now()); // softDelete까지 수행함.
  }

  private constructor(funding: Funding, donor: User, amount: number) {
    this.funding = funding;
    this.user = donor;
    this.donAmnt = amount;
    this.donStat = DonationStatus.Donated;
    this.orderId = require('order-id')('key').generate();
  }

  static create(
    funding: Funding,
    donor: User,
    amount: number,
    g2gException: GiftogetherExceptions,
  ) {
    if (amount > funding.fundGoal) {
      // [정책] 후원금액의 최대치는 펀딩금액을 넘지 못합니다.
      throw g2gException.DonationAmountExceeded;
    }

    // TODO - Add RollingPaper for inner object
    return new Donation(funding, donor, amount);
  }
}
