import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Funding } from './funding.entity';
import { User } from './user.entity';
import { JoinColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  comId: number;

  @ManyToOne(() => Funding, (funding) => funding.comments)
  @JoinColumn({ name: 'fundId' })
  funding: Funding;

  @Column()
  fundId: number;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column()
  authorId: number;

  @Column('varchar')
  content: string;

  @CreateDateColumn()
  regAt: Date;

  @Column('bool', { default: false })
  isMod: boolean;

  @Column('bool', { default: false })
  isDel: boolean;

  constructor(comment: Partial<Comment>) {
    Object.assign(this, comment);
  }
}
