import { ImageType } from 'src/enums/image-type.enum';
import { Column, Entity, PrimaryGeneratedColumn, Index, OneToOne } from 'typeorm';
import { Gratitude } from './gratitude.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  imgId: number;

  @Column('varchar')
  imgUrl: string;

  @Index({ unique: false })
  @Column({
    type: 'enum',
    enum: ImageType,
  })
  imgType: ImageType;

  @Index({ unique: false })
  @Column('int', { nullable: true })
  subId: number;

  constructor(imgUrl: string, imgType: ImageType, subId: number) {
    this.imgUrl = imgUrl;
    this.imgType = imgType;
    this.subId = subId;
  }
}
