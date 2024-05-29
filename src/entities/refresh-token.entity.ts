import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RefreshToken{

  @PrimaryGeneratedColumn()
  private tokenId: number;

  @Column()
  userId: number;

  @Column()
  refreshToken: string;

  @Column()
  expiresAt: Date;

  @Column({ default: true })
  isActive: boolean;

}