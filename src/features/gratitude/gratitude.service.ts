import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gratitude } from 'src/entities/gratitude.entity';
import { Repository } from 'typeorm';
import { GratitudeDto } from './dto/gratitude.dto';
import { Funding } from 'src/entities/funding.entity';
import { Image } from 'src/entities/image.entity';
import { ImageType } from 'src/enums/image-type.enum';
import {
  DefaultImageId,
  defaultGratitudeImageIds,
} from 'src/enums/default-image-id';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import assert from 'node:assert';
import { GetGratitudeDto } from './dto/get-gratitude.dto';

@Injectable()
export class GratitudeService {
  constructor(
    @InjectRepository(Gratitude)
    private readonly gratitudeRepo: Repository<Gratitude>,

    @InjectRepository(Funding)
    private readonly fundingRepo: Repository<Funding>,

    @InjectRepository(Image)
    private readonly imgRepo: Repository<Image>,

    private readonly g2gException: GiftogetherExceptions,
  ) {}

  async getGratitude(fundUuid: string): Promise<GetGratitudeDto> {
    const funding = await this.fundingRepo.findOne({ where: { fundUuid } });
    if (!funding) throw this.g2gException.FundingNotExists;

    const grat = await this.gratitudeRepo.findOne({
      where: { gratId: funding.fundId },
    });
    if (!grat) throw this.g2gException.GratitudeNotExist;

    let returnImgUrl = [];

    if (grat.defaultImgId) {
      const img = await this.imgRepo.findOne({
        where: { imgId: grat.defaultImgId },
      });
      returnImgUrl.push(img.imgUrl);
    } else {
      const images = await this.imgRepo.find({
        where: { imgType: ImageType.Gratitude, subId: grat.gratId },
      });
      returnImgUrl.push(images.map((i) => i.imgUrl));
    }

    return new GetGratitudeDto(
      funding.fundId,
      grat.gratTitle,
      grat.gratCont,
      returnImgUrl,
    );
  }

  async createGratitude(
    fundUuid: string,
    gratitudeDto: GratitudeDto,
  ): Promise<GetGratitudeDto> {
    const funding = await this.fundingRepo.findOne({
      where: { fundUuid },
    });
    if (!funding) throw this.g2gException.FundingNotExists;

    const grat = await this.gratitudeRepo.findOne({
      where: { gratId: funding.fundId },
    });
    if (grat) throw this.g2gException.GratitudeAlreadyExists;

    const returnImgUrl = gratitudeDto.gratImg;

    if (gratitudeDto.gratImg.length > 0) {
      // 사용자 정의 이미지 제공시,
      // 1. 새 grat 생성 및 저장.
      // 2. gratId를 subId로 갖는 새 image 생성 및 저장.
      const grat = await this.gratitudeRepo.save(
        new Gratitude(
          funding.fundId,
          gratitudeDto.gratTitle,
          gratitudeDto.gratCont,
        ),
      );

      this.imgRepo.insert(
        gratitudeDto.gratImg.map(
          (url) => new Image(url, ImageType.Gratitude, grat.gratId),
        ),
      );
    } else {
      if (!gratitudeDto.defaultImgId)
        throw this.g2gException.DefaultImgIdNotExist;
      if (!defaultGratitudeImageIds.includes(gratitudeDto.defaultImgId))
        throw this.g2gException.DefaultImgIdNotExist;
      // 기본 이미지 제공시,
      // 1. defaultImgId를 갖는 새 grat 생성 및 저장.

      const grat = new Gratitude(
        funding.fundId,
        gratitudeDto.gratTitle,
        gratitudeDto.gratCont,
      );
      grat.defaultImgId = gratitudeDto.defaultImgId!;

      this.gratitudeRepo.insert(grat);

      const image = await this.imgRepo.findOne({
        where: {
          imgType: ImageType.Gratitude,
          subId: grat.gratId,
        },
      });
      returnImgUrl.push(image.imgUrl);
    }

    return new GetGratitudeDto(
      funding.fundId,
      gratitudeDto.gratTitle,
      gratitudeDto.gratCont,
      returnImgUrl,
    );
  }

  async updateGratitude(
    fundUuid: string,
    gratitudeDto: GratitudeDto,
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
      this.imgRepo.delete({ imgType: ImageType.Gratitude, subId: gratId });

      // 1.
      this.imgRepo.save(
        gratImg.map((url) => new Image(url, ImageType.Gratitude, gratId)),
      );

      // 2.
      this.gratitudeRepo.update(gratId, {
        gratTitle,
        gratCont,
        defaultImgId: null,
      });
    } else {
      if (!defaultImgId) throw this.g2gException.DefaultImgIdNotExist;
      if (!defaultGratitudeImageIds.includes(defaultImgId))
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
      this.imgRepo.delete({ imgType: ImageType.Gratitude, subId: gratId });

      // 3.
      const image = await this.imgRepo.findOne({
        where: { imgId: defaultImgId },
      });
      imgUrl = [image.imgUrl];
    }
    return new GetGratitudeDto(gratId, gratTitle, gratCont, imgUrl);
  }

  async deleteGratitude(gratId: number) {
    const gratitude = await this.gratitudeRepo.findOneBy({ gratId });
    if (gratitude) {
      console.log(gratitude);
      gratitude.isDel = true;
      // TODO delete gratitude Images
      await this.gratitudeRepo.save(gratitude);
      return true;
    } else {
      return false;
    }
  }
}
