import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Address {
  @PrimaryGeneratedColumn()
  addrId: number;

  @Column()
  userId: number;

  @Column({ nullable: false })
  addrRoad: string;

  @Column({ nullable: false })
  addrDetl: string;

  @Column({ nullable: false })
  addrZip: number;

  @Column()
  addrNick: string;

  @Column({ default: false })
  isDef: boolean;
}
