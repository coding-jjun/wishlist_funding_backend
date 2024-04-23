import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { Funding } from './funding.entity';

@Entity()
export class Gratitude {

  @PrimaryGeneratedColumn()
  gratId: number;

  @OneToOne(() => Funding)
  @JoinColumn({ name: 'fundId', referencedColumnName: 'fundId' })
  funding: Funding;
  
  @Column()
  gratTitle: string;
  
  @Column()
  gratCont: string;
  
  @CreateDateColumn()
  regAt: Date;

  @Column('bool', { default: false })
  isDel: boolean;

  constructor(funding :Funding, gratTitle: string, gratCont: string){
    this.funding = funding;
    this.gratTitle = gratTitle;
    this.gratCont = gratCont;
  }

}

