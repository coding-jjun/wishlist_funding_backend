import { FriendStatus } from "src/enums/friend-status.enum";
import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Friend {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  friendId: number;

  @Column({ type: 'bit varying', default: '01', nullable: false, width: 2, comment: '00:친구, 01: 요청, 10:거절, 11:차단' })
  status: FriendStatus;

  @CreateDateColumn()
  regAt: Date;
}