import { Column, Entity } from "typeorm";

@Entity()
export class RefreshToken{

  @Column({unique: true})
  userId: number;

  @Column()
  refreshToken: string;

  @Column()
  expiresAt: Date;

  @Column({ default: true })
  isActive: boolean;

}