import { Entity, OneToMany } from 'typeorm';
import { Funding } from './funding.entity';
import { Comment } from './comment.entity';

@Entity()
export class User {
  @OneToMany(() => Funding, (funding) => funding.fundUser)
  fundings: Funding[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];
}
