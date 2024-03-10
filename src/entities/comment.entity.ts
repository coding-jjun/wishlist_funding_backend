import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Funding } from './funding.entity';
import { User } from './user.entity';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    comId: number;

    @ManyToOne(() => Funding, (funding) => funding.comments)
    funding: Funding;

    @ManyToOne(() => User, (user) => user.comments)
    author: User;

    @Column('varchar')
    content: string;

    @CreateDateColumn()
    regAt: Date;

    @Column('bool', { default: false })
    isMod: boolean;

    @Column('bool', { default: false })
    isDel: boolean;
}
