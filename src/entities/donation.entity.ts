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
} from 'typeorm';

@Entity()
export class Donation {
  @PrimaryGeneratedColumn()
  donId: number;

  @ManyToOne(() => Funding)
  @JoinColumn({ name: 'fundId', referencedColumnName: 'fundId' })
  funding: Funding;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: DonationStatus,
    default: DonationStatus.Donated,
  })
  donStat: DonationStatus;

  @Column()
  orderId: string;

  @Column({ default: 0 })
  donAmnt: number;

  @CreateDateColumn()
  regAt: Date;

  @DeleteDateColumn()
  delAt: Date;
}
