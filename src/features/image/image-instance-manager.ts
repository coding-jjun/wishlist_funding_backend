import { Injectable } from '@nestjs/common';
import { IImageId } from 'src/interfaces/image-id.interface';
import { ImageService } from './image.service';
import { Image } from 'src/entities/image.entity';

@Injectable()
export class ImageInstanceManager {
  constructor(private readonly imageService: ImageService) {}

  async getImages<T extends IImageId>(entity: T): Promise<Image[]> {
    if (entity.defaultImgId) {
      // defaultImgId가 존재하면 해당 이미지만 반환
      const defaultImg = await this.imageService.getInstanceByPK(
        entity.defaultImgId,
      );
      return [defaultImg];
    }
    // defaultImgId가 없으면 subId를 사용해 관련 이미지 반환
    return this.imageService.getInstancesBySubId(
      entity.imageType,
      entity.imgSubId,
    );
  }

  /**
   * 이미지 Update 수행중 새 이미지 URL로 교체하는 유스케이스에 대응합니다.
   * 기본이미지로 교체하고 싶다면 `resetToDefault`를 사용하세요.
   * TODO - Implement
   * @param newImageUrls not default image URL
   */
  async overwrite(entity: T, newImageUrls: string[]): Promise<string[]> {
    throw new Error('Not Implemented');
  }

  /**
   * 이미지 Update 수행 중 기존에 이미지를 삭제하고 기본 이미지로 교체하는
   * 유스케이스에 대응합니다.
   *
   * TODO - Implement
   * @param defaultImgId 여기에선 이 id가 기본 이미지인지 여부를 검사하지 않습니다.
   */
  async resetToDefault(entity: T, defaultImgId: number): Promise<string> {
    throw new Error('Not Implemented');
  }
}
