import {
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Donation } from './donation.entity';

@Entity()
export class RollingPaper {
  @PrimaryGeneratedColumn()
  rollId: number;

  @OneToOne(() => Donation, {cascade: true})
  @JoinColumn({ name: 'donId', referencedColumnName: 'donId' })
  donation: Donation;

  @Column()
  fundId: number;

  // @OneToOne(() => Image, img => img.imgId)
  // @JoinColumn({ name: 'rollImg' })
  // rollImg: string;

  @Column({ default: '축하해요' })
  rollMsg: string;

  @DeleteDateColumn()
  delAt: Date;
}
