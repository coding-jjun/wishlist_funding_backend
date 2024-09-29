import { ImageType } from 'src/enums/image-type.enum';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

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

  @ManyToOne(() => User, (user) => user.createdImages)
  creator: User;

  constructor(imgUrl: string, imgType: ImageType, subId: number) {
    this.imgUrl = imgUrl;
    this.imgType = imgType;
    this.subId = subId;
  }
}
