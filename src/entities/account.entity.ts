import { BankType } from 'src/enums/bank-type.enum';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  accId: number;

  @Column({ type: 'enum', enum: BankType, nullable: false })
  bank: BankType;

  @Column({ unique: true, nullable: false })
  accNum: string;

  @OneToOne(() => User, user => user.account)
  user: User;
}