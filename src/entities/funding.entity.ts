import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { FundTheme } from '../enums/fundtheme.enum';
import { Min } from 'class-validator';

@Entity()
export class Funding {
  @PrimaryGeneratedColumn()
  fundId: number;

  // @PrimaryGeneratedColumn("uuid")
  // fundUuid: string;

  @ManyToOne(() => User, (user) => user.fundings)
  fundUser: User;

  @Column('varchar')
  fundTitle: string;

  @Column('varchar')
  fundCont: string;

  @Column({
    type: 'enum',
    enum: FundTheme,
    default: FundTheme.Birthday,
  })
  fundTheme: FundTheme;

  @Column('boolean', { default: true })
  fundPubl: boolean;

  @Column('int')
  @Min(0)
  fundGoal: number;

  @Column('int', { default: 0 })
  @Min(0)
  fundSum: number;

  @OneToMany(() => Comment, (comment) => comment.funding)
  comments: Comment[];

  /**
   * TODO - timestamptz를 사용할지, 일반 date를 사용할지 결정해야함.
   * timestamptz는 시간 & 타임존을 포함하고 date는 말 그대로 날짜만 저장함
   */
  // @Column("date")
  @Column('timestamptz')
  endAt: Date;

  @CreateDateColumn()
  regAt: Date;

  @UpdateDateColumn()
  uptAt: Date;
}
