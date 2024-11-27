import {
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { Donation } from './donation.entity';
import { Image } from './image.entity';
import { IImageId } from 'src/interfaces/image-id.interface';
import { ImageType } from 'src/enums/image-type.enum';

@Entity()
export class RollingPaper implements IImageId {
  get imgSubId(): number {
    return this.rollId;
  }
  get imageType(): ImageType {
    return ImageType.RollingPaper;
  }
  @PrimaryColumn()
  rollId: number;

  @OneToOne(() => Donation, { cascade: true })
  @JoinColumn({ name: 'rollId', referencedColumnName: 'donId' })
  donation: Donation;

  @Column()
  fundId: number;

  @Column('int', { nullable: true })
  @ManyToOne(() => Image, (image) => image.imgId)
  @JoinColumn({ name: 'defaultImgId' })
  defaultImgId: number;

  @Column({ default: '축하해요' })
  rollMsg: string;

  @DeleteDateColumn()
  delAt: Date;
}
