import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gratitude } from 'src/entities/gratitude.entity';
import { Repository } from 'typeorm';
import { GratitudeDto } from './dto/gratitude.dto';
import { Funding } from 'src/entities/funding.entity';
import { Image } from 'src/entities/image.entity';
import { ImageType } from 'src/enums/image-type.enum';
import { DefaultImageId } from 'src/enums/default-image-id';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';

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
    const funding = await this.fundingRepo.findOne({ where: { fundUuid } });

    let grat = await this.gratitudeRepo.findOne({
      where: { gratId: funding.fundId },
    });

    if (grat) {
      throw this.g2gException.GratitudeAlreadyExists;
    }

    grat = await this.gratitudeRepo.save(
      new Gratitude(
        funding.fundId,
        gratitudeDto.gratTitle,
        gratitudeDto.gratCont,
      ),
    );
    if (gratitudeDto.gratImg.length > 0) {
      this.imgRepo.save(
        gratitudeDto.gratImg.map(
          (url) => new Image(url, ImageType.Gratitude, grat.gratId),
        ),
      );
    } else {
      // defaultImgId 필드에 gratitude 기본 이미지 ID를 넣는다.
      await this.gratitudeRepo.update(grat.gratId, {
        defaultImgId: DefaultImageId.Gratitude,
      });
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
