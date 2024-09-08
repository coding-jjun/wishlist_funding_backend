import { Injectable } from '@nestjs/common';
import { ImageType } from 'src/enums/image-type.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from 'src/entities/image.entity';
import { Repository } from 'typeorm';
import { S3Service } from './s3.service';
import { GiftogetherException } from 'src/filters/giftogether-exception';

@Injectable()
export class ImageService {
  constructor(
    private readonly s3Service: S3Service,
    @InjectRepository(Image) private readonly imgRepo: Repository<Image>,
  ) {}

  private async getInstancesBySubId(
    imgType: ImageType,
    subId: number,
  ): Promise<Image[]> {
    return this.imgRepo.find({
      where: { imgType, subId },
    });
  }

  /**
   * Image Table에서 subId가 일치하는 레코드를 제거하고 S3 delete도 같이 수행합니다.
   * @param imgType 연관 테이블 타입
   * @param subId FK
   */
  async delete(imgType: ImageType, subId: number) {
    const images = await this.getInstancesBySubId(imgType, subId);
    const removePromises = images.map(async (i) => {
      return this.s3Service.delete(i.imgUrl);
    });
    await Promise.all(removePromises).catch((e) => {
      if (e instanceof GiftogetherException) {
        // do nothing
        return;
      }
      throw e;
    });
    this.imgRepo.remove(images);
  }
}
