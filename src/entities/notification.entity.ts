import { NotiType, ReqType } from 'src/enums/notification.enum';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn()
  notiId: number;

  @Column()
  recvId: number;

  @Column()
  sendId: number;

  @Column({ type: 'enum', enum: NotiType })
  notiType: NotiType;

  @Column({ type: 'enum', enum: ReqType })
  reqType: ReqType;

  @Column()
  subId: number;

  @CreateDateColumn()
  notiTime: Date;
}
