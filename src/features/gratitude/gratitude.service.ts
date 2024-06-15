import { Injectable } from '@nestjs/common';
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

  async getGratitude(fundUuid: string): Promise<GratitudeDto> {
    // TODO find all image url
    const funding = await this.fundingRepo.findOne({ where: { fundUuid } });
    const grat = await this.gratitudeRepo.findOne({
      where: { gratId: funding.fundId },
    });

    if (grat.defaultImgId) {
      const img = await this.imgRepo.findOne({
        where: { imgId: grat.defaultImgId },
      });
      return new GratitudeDto(grat.gratTitle, grat.gratCont, [img.imgUrl]);
    }

    const images = await this.imgRepo.find({
      where: { imgType: ImageType.Gratitude, subId: grat.gratId },
    });

    return new GratitudeDto(
      grat.gratTitle,
      grat.gratCont,
      images.map((img) => img.imgUrl),
    );
  }

  async createGratitude(fundUuid: string, gratitudeDto: GratitudeDto) {
    const funding = await this.fundingRepo.findOne({
      where: { fundUuid },
    });
    if (!funding) throw this.g2gException.FundingNotExists;

    const grat = await this.gratitudeRepo.findOne({
      where: { gratId: funding.fundId },
    });
    if (grat) throw this.g2gException.GratitudeAlreadyExists;

    if (gratitudeDto.gratImg.length > 0) {
      // 사용자 정의 이미지 제공시,
      // 1. 새 grat 생성 및 저장.
      // 2. gratId를 subId로 갖는 새 image 생성 및 저장.
      const grat = (
        await this.gratitudeRepo.insert(
          new Gratitude(
            funding.fundId,
            gratitudeDto.gratTitle,
            gratitudeDto.gratCont,
          ),
        )
      ).generatedMaps[0] as Gratitude;

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

      await this.gratitudeRepo.insert(grat);
    }

    return grat;
  }

  async updateGratitude(gratId: number, gratitudeDto: GratitudeDto) {
    const gratitude = await this.gratitudeRepo.findOneBy({ gratId });
    gratitude.gratTitle = gratitudeDto.gratTitle;
    gratitude.gratCont = gratitudeDto.gratCont;
    // TODO update gratitude image
    return await this.gratitudeRepo.save(gratitude);
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
