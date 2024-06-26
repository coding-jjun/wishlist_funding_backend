import { NotiType, ReqType } from 'src/enums/notification.enum';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn()
  notiId: number;

  // @Column()
  // recvId: number;

  // @Column()
  // sendId: number;

  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'recvId' })
  recvId: User;
  
  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'sendId' })
  sendId: User;

  @Column({ type: 'enum', enum: NotiType })
  notiType: NotiType;

  @Column({ type: 'enum', enum: ReqType, nullable: true })
  reqType: ReqType;

  @Column({ nullable: true })
  subId: number;

  @CreateDateColumn()
  notiTime: Date;
}
