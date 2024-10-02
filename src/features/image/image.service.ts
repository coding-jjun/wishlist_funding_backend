import { Injectable } from '@nestjs/common';
import { ImageType } from 'src/enums/image-type.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from 'src/entities/image.entity';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image) private readonly imgRepo: Repository<Image>,
    private readonly g2gException: GiftogetherExceptions,
  ) {}

  async getInstancesBySubId(
    imgType: ImageType,
    subId: number,
  ): Promise<Image[]> {
    return this.imgRepo.find({
      where: { imgType, subId },
    });
  }

  /**
   * 이미지를 생성하거나 업데이트합니다.
   *
   * 이미지를 업데이트 하는 경우: 레코드가 존재하며 type, subId가 NULL인 경우
   * 이미지를 생성하는 경우: 레코드가 존재하지 않는 경우
   *
   * @param type 이미지의 타입 (NULL인 경우 S3에 업로드만 한 임시 객체임을 의미.)
   * @param subId 참조되는 이미지의 서브 ID (NULL인 경우 S3에 업로드만 한 임시 객체임을 의미.)
   */
  async save(
    imgUrl: string,
    creator: User,
    imgType?: ImageType,
    subId?: number,
  ): Promise<Image> {
    if (
      (imgType === null && subId !== null) ||
      (imgType !== null && subId === null)
    ) {
      throw this.g2gException.ImageIntegrityError;
    }

    const foundImg = await this.imgRepo
      .createQueryBuilder('image')
      .leftJoinAndSelect('image.creator', 'user')
      .where('image.imgUrl = :imgURl', { imgUrl })
      .andWhere('user.userId = :userId', { userId: creator.userId })
      .getOne();

    if (!foundImg) {
      const newImg = new Image(imgUrl, imgType, subId, creator);
      return this.imgRepo.save(newImg);
    }

    // foundImg EXISTS

    if (foundImg.isTemporary()) {
      foundImg.imgType = imgType;
      foundImg.subId = subId;
      return this.imgRepo.save(foundImg);
    }

    // foundImg is not temporary

    if (foundImg.imgType === imgType && foundImg.subId === subId) {
      // 동일한 이미지
      return foundImg;
    }
    
    throw this.g2gException.ImageAlreadyExists;
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
    const image = await this.imgRepo
      .createQueryBuilder('image')
      .leftJoinAndSelect('image.creator', 'user')
      .where('image.imgUrl = :imgUrl', { imgUrl })
      .andWhere('user.userId = :userId', { userId: creator.userId })
      .getOne();

    if (!image) {
      throw this.g2gException.ImageNotFound;
    }

    return this.imgRepo.remove(image);
  }
}
