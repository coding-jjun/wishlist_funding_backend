import { ImageType } from 'src/enums/image-type.enum';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
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
}
