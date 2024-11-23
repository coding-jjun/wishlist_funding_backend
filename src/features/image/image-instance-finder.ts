import { Injectable } from '@nestjs/common';
import { IImageId } from 'src/interfaces/image-id.interface';
import { ImageService } from './image.service';
import { Image } from 'src/entities/image.entity';

@Injectable()
export class ImageInstanceFinder<T extends IImageId> {
  constructor(private readonly imageService: ImageService) {}

  async getImages(entity: T): Promise<Image[]> {
    if (entity.defaultImgId) {
      // defaultImgId가 존재하면 해당 이미지만 반환
      const defaultImg = await this.imageService.getInstanceByPK(
        entity.defaultImgId,
      );
      return [defaultImg];
    }
    // defaultImgId가 없으면 subId를 사용해 관련 이미지 반환
    return this.imageService.getInstancesBySubId(entity.imageType, entity.id);
  }
}
