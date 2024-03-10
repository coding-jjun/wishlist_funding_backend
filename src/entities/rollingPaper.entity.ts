import { Column, Entity, OneToOne, JoinColumn, PrimaryColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class RollingPaper {
    @PrimaryColumn()
    rollId: number;

    // @OneToOne(() => Image, img => img.imgId)
    // @JoinColumn({ name: 'rollImg' })
    // rollImg: Image;

    @Column({default:'축하해요'})
    rollMsg	:string
    
    @DeleteDateColumn()
    delAt: Date;

}