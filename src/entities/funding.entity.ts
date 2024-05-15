import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  Generated,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { FundTheme } from 'src/enums/fund-theme.enum';
import { Gift } from './gift.entity';
import { Donation } from './donation.entity';
import { Image } from './image.entity';
import { ValidateNested } from 'class-validator';

@Entity()
export class Funding {
  constructor(
    fundUser: User,
    fundTitle: string,
    fundCont: string,
    fundGoal: number,
    endAt: Date,
    fundTheme?: FundTheme,
    fundPubl?: boolean,
  ) {
    this.fundUser = fundUser;
    this.fundTitle = fundTitle;
    this.fundCont = fundCont;
    this.fundGoal = fundGoal;
    this.endAt = endAt;
    this.fundTheme = fundTheme;
    this.fundPubl = fundPubl;
  }

  @PrimaryGeneratedColumn()
  fundId: number;

  @Index()
  @Column()
  @Generated('uuid')
  fundUuid: string;

  @ManyToOne(() => User, (user) => user.fundings)
  @JoinColumn({ name: 'fundUser' })
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
  fundGoal: number;

  @Column('int', { default: 0 })
  fundSum: number;

  @OneToMany(() => Comment, (comment) => comment.funding)
  comments: Comment[];

  @OneToMany(() => Gift, (gift) => gift.funding)
  gifts: Gift[];

  @OneToMany(() => Donation, (donation) => donation.funding, {
    cascade: true,
  })
  donations: Donation[];

  /**
   * defaultImgId가 null인 경우, Image.subId로 이미지를 가져올 수 있습니다.
   */
  @Column('int', { nullable: true })
  @OneToOne(() => Image, (image) => image.imgId)
  defaultImgId: number;

  @ValidateNested()
  @OneToMany(() => Image, (image) => image.subId)
  images: Image[];

  /**
   * TODO - timestamptz를 사용할지, 일반 date를 사용할지 결정해야함.
   * timestamptz는 시간 & 타임존을 포함하고 date는 말 그대로 날짜만 저장함
   */
  @Column('date')
  // @Column('timestamptz')
  endAt: Date;

  @CreateDateColumn()
  regAt: Date;

  @UpdateDateColumn()
  uptAt: Date;
}
