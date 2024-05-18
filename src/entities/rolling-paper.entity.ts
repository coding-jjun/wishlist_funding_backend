import {
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Donation } from './donation.entity';
import { Image } from './image.entity';

@Entity()
export class RollingPaper {
  @PrimaryColumn()
  rollId: number;

  @OneToOne(() => Donation, { cascade: true })
  @JoinColumn({ name: 'donId', referencedColumnName: 'donId' })
  donation: Donation;

  @Column()
  fundId: number;

  @Column('int', { nullable: true })
  @OneToOne(() => Image, (image) => image.imgId)
  @JoinColumn({ name: 'defaultImgId' })
  defaultImgId: number;

  @Column({ default: '축하해요' })
  rollMsg: string;

  @DeleteDateColumn()
  delAt: Date;
}
