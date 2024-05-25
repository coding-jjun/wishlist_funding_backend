import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Funding } from './funding.entity';
import { Comment } from './comment.entity';
import { Account } from './account.entity';
import { Image } from './image.entity';
import { Address } from './address.entity';
import { AuthType } from 'src/enums/auth-type.enum';
import { ValidateNested } from 'class-validator';
import { DefaultImageId } from 'src/enums/default-image-id';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ nullable: true })
  authId: string;

  @Column({ default: AuthType.Jwt })
  authType: AuthType;

  @Column({ unique: true })
  userNick: string;

  @Column({ nullable: true })
  userPw: string;

  @Column({ nullable: true })
  userName: string;

  @Column({ unique: true, nullable: true })
  userPhone: string;

  @Column({ nullable: true })
  userEmail: string;

  @Column('date', { nullable: true })
  userBirth: Date;

  @OneToOne(() => Account, (account) => account.user, { nullable: true })
  @JoinColumn({ name: 'userAcc' })
  account: Account;

  @CreateDateColumn()
  regAt: Date;

  @UpdateDateColumn()
  uptAt: Date;

  @DeleteDateColumn()
  delAt: Date;

  @OneToMany(() => Funding, (funding) => funding.fundUser)
  fundings: Funding[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => Address, (address) => address.addrUser)
  addresses: Address[];
  user: Promise<Date>;

  @Column('int', { nullable: true })
  @OneToOne(() => Image, (image) => image.imgId)
  defaultImgId?: number;

  /**
   * defaultImgId가 NULL일 경우, Image.subId로 조회할 수 있습니다.
   */
  @ValidateNested()
  @OneToOne(() => Image, (image) => image.subId)
  image: Image;
}
