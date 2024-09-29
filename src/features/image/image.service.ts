import { Injectable } from '@nestjs/common';
import { ImageType } from 'src/enums/image-type.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from 'src/entities/image.entity';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export class ImageService {
  constructor(
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
   * Image Table에서 subId가 일치하는 레코드를 제거한다
   * @param imgType 연관 테이블 타입
   * @param subId FK
   * @returns 제거된 이미지 인스턴스들
   */
  async delete(imgType: ImageType, subId: number) {
    const images = await this.getInstancesBySubId(imgType, subId);
    return this.imgRepo.remove(images);
  }

  /**
   * Image Table에서 URL이 일치하는 레코드를 제거한다.
   * @note 이 메서드는 컨트롤러에서 인가 작업이 완료가 된 다음 호출해야 안전합니다.
   */
  async deleteByUrlAndUser(imgUrl: string, creator: User) {
    const image = await this.imgRepo.findOneOrFail({
      where: { imgUrl, creator },
    });

    return this.imgRepo.remove(image);
  }
}
