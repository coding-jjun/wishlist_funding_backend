import { Entity, Column, PrimaryGeneratedColumn, Timestamp, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column({ unique: true })
    userNick: string;

    @Column()
    userPw: string;

    @Column()
    userName: string;

    @Column({ unique: true })
    userPhone: string;

    @Column()
    userEmail: string;

    @Column('date')
    userBirth: Date;

    @Column({ unique: true })
    accId: number;

    @Column()
    userImg: number;

    @CreateDateColumn()
    regAt: Date;

    @UpdateDateColumn()
    uptAt: Date;

    @DeleteDateColumn()
    delAt: Date;
}