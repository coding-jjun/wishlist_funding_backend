import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryColumn,
  OneToOne
} from 'typeorm';
import { Image } from './image.entity';

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
  
  @Column('int', { nullable: true })
  @OneToOne(() => Image, (image) => image.imgId)
  defaultImgId: number;

  constructor(gratId :number, gratTitle: string, gratCont: string){
    this.gratId = gratId;
    this.gratTitle = gratTitle;
    this.gratCont = gratCont;
  }

}

