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

  @Index({ unique: true })
  @Column({
    type: 'enum',
    enum: ImageType,
  })
  imgType: ImageType;
  
  @Index({ unique: true })
  @Column('int')
  subId: number;
}
