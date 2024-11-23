import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Funding } from './funding.entity';
import { Image } from './image.entity';
import { IImageId } from 'src/interfaces/image-id.interface';
import { ImageType } from 'src/enums/image-type.enum';

@Entity()
export class Gift implements IImageId {
  get id(): number {
    return this.giftId;
  }

  imageType: ImageType = ImageType.Gift;

  @PrimaryGeneratedColumn()
  giftId: number;

  @ManyToOne(() => Funding, (funding) => funding.fundId)
  @JoinColumn({ name: 'fundId' })
  funding: Funding;

  @Column({ nullable: false })
  giftTitle: string;

  @Column()
  giftUrl: string;

  @Column()
  giftOrd: number;

  @Column({ nullable: true })
  giftOpt: string;

  @Column({ nullable: true, length: 20 })
  giftCont: string;

  @Column({ nullable: true })
  @ManyToOne(() => Image, (image) => image.imgId)
  defaultImgId?: number;
}
