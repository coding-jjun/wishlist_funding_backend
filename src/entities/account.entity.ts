import { BankType } from 'src/enums/bank-type.enum';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  accId: number;

  @Column({ type: 'enum', enum: BankType, nullable: false })
  bank: BankType;

  @Column({ unique: true, nullable: false })
  accNum: string;
}