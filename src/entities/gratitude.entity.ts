import {
  Column,
  Entity,
  PrimaryColumn,
  CreateDateColumn
} from 'typeorm';

@Entity()
export class Gratitude {

  @PrimaryColumn()
  gratId: number;

  @Column()
  gratTitle: string;
  
  @Column()
  gratCont: string;
  
  @CreateDateColumn()
  regAt: Date;

  @Column('bool', { default: false })
  isDel: boolean;

}

