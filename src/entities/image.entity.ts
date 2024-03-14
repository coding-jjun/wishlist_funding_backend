import { ImageType } from 'src/enums/image-type.enum';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Index
} from 'typeorm';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  imgId: number;

  @Column('varchar')
  imgUrl: string;

  @Column({
    type: 'enum',
    enum: ImageType,
  })
  imgType: ImageType;
  
  @Column('int')
  subId: number;

  @Index('subId_imgType_index', { unique: true })
  subIdImgTypeIndex: [number, ImageType];

}
