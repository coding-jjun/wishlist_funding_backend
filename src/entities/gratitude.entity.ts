import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryColumn
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

  constructor(gratId :number, gratTitle: string, gratCont: string){
    this.gratId = gratId;
    this.gratTitle = gratTitle;
    this.gratCont = gratCont;
  }

}

