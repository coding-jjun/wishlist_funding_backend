import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gratitude } from 'src/entities/gratitude.entity';
import { Repository } from 'typeorm';
import { GratitudeDto } from './dto/gratitude.dto';
import { Funding } from 'src/entities/funding.entity';
import { Image } from 'src/entities/image.entity';
import { ImageType } from 'src/enums/image-type.enum';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { GetGratitudeDto } from './dto/get-gratitude.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DefaultImageIds } from 'src/enums/default-image-id';
import { ImageService } from '../image/image.service';
import { User } from 'src/entities/user.entity';
import { FundingService } from '../funding/funding.service';
import { ImageInstanceManager } from '../image/image-instance-manager';

@Injectable()
export class GratitudeService {
  constructor(
    @InjectRepository(Gratitude)
    private readonly gratitudeRepo: Repository<Gratitude>,

    @InjectRepository(Funding)
    private readonly fundingRepo: Repository<Funding>,

    private readonly g2gException: GiftogetherExceptions,

    private eventEmitter: EventEmitter2,

    private readonly imgService: ImageService,

    private readonly imageManager: ImageInstanceManager,

    private readonly fundingService: FundingService,
  ) {}

  async getGratitude(fundUuid: string): Promise<GetGratitudeDto> {
    const funding = await this.fundingRepo.findOne({ where: { fundUuid } });
    if (!funding) throw this.g2gException.FundingNotExists;

    const grat = await this.gratitudeRepo.findOne({
      where: { gratId: funding.fundId },
    });
    if (!grat) throw this.g2gException.GratitudeNotExist;

    const returnImgUrl = await this.imageManager
      .getImages(grat)
      .then((images) => images.map((i) => i.imgUrl));

    return new GetGratitudeDto(
      funding.fundUuid,
      grat.gratTitle,
      grat.gratCont,
      returnImgUrl,
    );
  }

  async createGratitude(
    fundUuid: string,
    gratitudeDto: GratitudeDto,
    user: User,
  ): Promise<GetGratitudeDto> {
    const funding = await this.fundingRepo.findOne({
      where: { fundUuid },
    });
    if (!funding) throw this.g2gException.FundingNotExists;

    let grat = await this.gratitudeRepo.findOne({
      where: { gratId: funding.fundId },
    });
    if (grat) throw this.g2gException.GratitudeAlreadyExists;

    grat = new Gratitude(
      funding.fundId,
      gratitudeDto.gratTitle,
      gratitudeDto.gratCont,
      gratitudeDto.defaultImgId,
    );

    grat = await this.gratitudeRepo.save(grat);

    const returnImgUrl = gratitudeDto.gratImg;

    if (gratitudeDto.gratImg.length > 0) {
      // 사용자 정의 이미지 제공시,
      // 1. 새 grat 생성 및 저장.
      // 2. gratId(=fundId)를 subId로 갖는 새 image 생성 및 저장.

      const imgPromises = gratitudeDto.gratImg.map(
        (url): Promise<Image> =>
          this.imgService.save(url, user, ImageType.Gratitude),
      );
      await Promise.all(imgPromises);
    } else {
      if (!gratitudeDto.defaultImgId)
        throw this.g2gException.DefaultImgIdNotExist;
      if (!DefaultImageIds.Gratitude.includes(gratitudeDto.defaultImgId))
        throw this.g2gException.DefaultImgIdNotExist;

      const image = await this.imgService.getInstanceByPK(grat.defaultImgId);
      returnImgUrl.push(image.imgUrl);
    }

    this.eventEmitter.emit('CheckGratitude', funding.fundId);

    return new GetGratitudeDto(
      funding.fundUuid,
      gratitudeDto.gratTitle,
      gratitudeDto.gratCont,
      returnImgUrl,
    );
  }

  async updateGratitude(
    fundUuid: string,
    gratitudeDto: GratitudeDto,
    user: User,
  ): Promise<GetGratitudeDto> {
    const funding = await this.fundingRepo.findOne({ where: { fundUuid } });
    if (!funding) throw this.g2gException.FundingNotExists;

    const gratId = funding.fundId;
    const grat = await this.gratitudeRepo.findOneBy({ gratId });
    if (!grat) throw this.g2gException.GratitudeNotExist;

    const { gratTitle, gratCont, gratImg, defaultImgId } = gratitudeDto;

    let imgUrl = gratImg; // return용

    if (gratImg.length > 0) {
      // 사용자 정의 이미지 제공시,
      // 0. 기존 gratId를 subId로 갖는 image들 삭제
      // 1. gratId를 subId로 갖는 새 image 생성 및 저장.
      // 2. grat update

      // 0.
      this.imgService.delete(ImageType.Gratitude, gratId);

      // 1.
      const imgPromises = gratImg.map(
        async (url): Promise<Image> =>
          this.imgService.save(url, user, ImageType.Gratitude, gratId),
      );
      Promise.all(imgPromises);

      // 2.
      this.gratitudeRepo.update(gratId, {
        gratTitle,
        gratCont,
        defaultImgId: null,
      });
    } else {
      if (!defaultImgId) throw this.g2gException.DefaultImgIdNotExist;
      if (!DefaultImageIds.Gratitude.includes(defaultImgId))
        throw this.g2gException.DefaultImgIdNotExist;
      // 기본 이미지 제공시,
      // 1. defaultImgId를 grat 업데이트
      // 2. subId가 gratId인 이미지들을 삭제한다.
      // 3. 리턴용 imgUrl을 갱신한다.

      grat.defaultImgId = defaultImgId!;

      // 1.
      await this.gratitudeRepo.update(gratId, {
        gratTitle,
        gratCont,
        defaultImgId,
      });

      // 2.
      this.imgService.delete(ImageType.Gratitude, gratId);

      // 3.
      const image = await this.imgService.getInstanceByPK(grat.defaultImgId);
      imgUrl = [image.imgUrl];
    }
    return new GetGratitudeDto(funding.fundUuid, gratTitle, gratCont, imgUrl);
  }

  /**
   * HARD DELETE 라는 점에 유의할 것
   * @param fundUuid fundId를 찾기 위해 한 번 쿼리를 날려야 함
   * @returns boolean
   */
  async deleteGratitude(fundUuid: string, user: User): Promise<boolean> {
    const fund = await this.fundingService.findFundingByUuidAndUserId(
      fundUuid,
      user.userId,
    );
    const gratitude = await this.gratitudeRepo.findOne({
      where: { gratId: fund.fundId },
    });
    if (gratitude) {
      this.imgService.delete(ImageType.Gratitude, gratitude.gratId);
      await this.gratitudeRepo.delete({ gratId: gratitude.gratId });
      return true;
    }

    throw this.g2gException.GratitudeNotExist;
  }
}
