import { NotiType } from 'src/enums/noti-type.enum';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn()
  notiId: number;

  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'recvId' })
  recvId: User;
  
  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'sendId' })
  @Column({ nullable: true })
  sendId: User;

  @Column({ type: 'enum', enum: NotiType })
  notiType: NotiType;

  @Column({ nullable: true })
  subId: string;

  @CreateDateColumn()
  notiTime: Date;
}
