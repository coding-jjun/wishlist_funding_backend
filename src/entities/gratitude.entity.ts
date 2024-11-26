import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Image } from './image.entity';
import { IImageId } from 'src/interfaces/image-id.interface';
import { ImageType } from 'src/enums/image-type.enum';

@Entity()
export class Gratitude implements IImageId {
  /**
   * fundId와 동일한 값을 가지고 있습니다.
   */
  @PrimaryColumn()
  gratId: number;

  @Column()
  gratTitle: string;

  @Column()
  gratCont: string;

  @CreateDateColumn()
  regAt: Date;

  @Column('bool', { default: false })
  isDel: boolean;

  @Column('int', { nullable: true })
  @ManyToOne(() => Image, (image) => image.imgId)
  @JoinColumn({ name: 'defaultImgId' })
  defaultImgId: number;

  constructor(
    gratId: number,
    gratTitle: string,
    gratCont: string,
    defaultImageId?: number,
  ) {
    this.gratId = gratId;
    this.gratTitle = gratTitle;
    this.gratCont = gratCont;
    this.defaultImgId = defaultImageId;
  }
  get imgSubId(): number {
    return this.gratId;
  }
  imageType: ImageType = ImageType.Gratitude;
}
