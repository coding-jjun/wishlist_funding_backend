import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
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

  @Column()
  giftUrl: string;

  @Column()
  giftOrd: number;

  @Column({ nullable: true })
  giftOpt: string;

  @Column({ nullable: true })
  giftCont: string;

  @OneToMany(() => Image, (image) => image.imgId, { nullable: true })
  @JoinColumn({ name: 'imgId' })
  images: Image[];
}
