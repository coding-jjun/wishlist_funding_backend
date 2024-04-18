import { FriendStatus } from "src/enums/friend-status.enum";
import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Friend {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  friendId: number;

  @Column({ type: 'enum', enum: FriendStatus, default: FriendStatus.Requested, nullable: false })
  status: FriendStatus;

  @CreateDateColumn()
  regAt: Date;
}