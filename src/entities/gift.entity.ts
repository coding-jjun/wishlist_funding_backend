import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Funding } from './funding.entity';
import { Image } from './image.entity';

@Entity()
export class Gift {
  @PrimaryGeneratedColumn()
  giftId: number;

  @ManyToOne(() => Funding, (funding) => funding.fundId)
  @JoinColumn({ name: 'fundId' })
  funding: Funding;

  @Column({ nullable: false })
  giftTitle: string;

  @Column()
  giftUrl: string;

  @Column()
  giftOrd: number;

  @Column({ nullable: true })
  giftOpt: string;

  @Column({ nullable: true, length: 20 })
  giftCont: string;

  @Column({ nullable: true })
  @ManyToOne(() => Image, (image) => image.imgId)
  defaultImgId?: number;
}
