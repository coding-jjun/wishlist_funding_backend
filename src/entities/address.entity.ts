import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  addrId: number;

  @ManyToOne(() => User, (user) => user.addresses)
  @JoinColumn({ name: 'userId' })
  addrUser: User;

  @Column({ nullable: false })
  addrNick: string;

  @Column({ nullable: false })
  addrRoad: string;

  @Column({ nullable: false })
  addrDetl: string;

  @Column({ nullable: false })
  addrZip: string;

  @Column({ default: false })
  isDef: boolean;
}
