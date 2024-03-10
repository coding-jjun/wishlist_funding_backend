import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Funding } from './funding.entity';
import { Comment } from './comment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @OneToMany(() => Funding, (funding) => funding.fundUser)
  fundings: Funding[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];
}
