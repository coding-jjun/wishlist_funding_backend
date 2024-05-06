import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GiftogetherError {
  @PrimaryGeneratedColumn()
  errId: number;
  
  @Column()
  method: string;

  @Column()
  url: string;

  @Column()
  agent: string;

  @Column({ nullable: true })
  ip: string;

  @Column()
  parameters: string;

  @Column()
  httpCode: number;

  @Column({ nullable: true })
  errCode: string;

  @Column()
  errName: string;

  @Column()
  errStack: string;

  @CreateDateColumn()
  regAt: Date;
}