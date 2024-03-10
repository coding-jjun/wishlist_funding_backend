import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm';


@Entity()
export class Donation {
    @PrimaryGeneratedColumn()
    donId: number;

    // @ManyToOne(() => Fund)
    // @JoinColumn({ name: 'fundId', referencedColumnName: 'fundId' })
    // funding: Funding;

    // @ManyToOne(() => User)
    // @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
    // user: User;

    @Column()
    orderId: string;

    @Column({default: 0})
    donAmnt: number;

    @CreateDateColumn()
    regAt: Date;

    @DeleteDateColumn()
    delAt: Date;
}