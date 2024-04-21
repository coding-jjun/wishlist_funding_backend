import {
  Column,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';
// import { User } from './user.entity';

@Entity()
export class OpenBankToken{
  @PrimaryGeneratedColumn()
  obtId: number; //openbankToken
  
  // @Column()
  // user : User;

  @Column()
  accessToken : string;
  
  @Column()
  refreshToken : string;
  
  @Column()
  expiresIn : number
  
  @Column()
  userSeq : number


}