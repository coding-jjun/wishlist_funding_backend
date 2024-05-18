import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RollingPaper } from 'src/entities/rolling-paper.entity';
import { Repository } from 'typeorm';
import { RollingPaperDto } from './dto/rolling-paper.dto';
import { Funding } from 'src/entities/funding.entity';
import { Image } from 'src/entities/image.entity';
import { DefaultImageId } from 'src/enums/default-image-id';
import { ImageType } from 'src/enums/image-type.enum';

@Injectable()
export class RollingPaperService {
  constructor(
    @InjectRepository(RollingPaper)
    private readonly rollingPaperRepo: Repository<RollingPaper>,

    @InjectRepository(Funding)
    private readonly fundingRepo: Repository<Funding>,

    @InjectRepository(Image)
    private readonly imgRepo: Repository<Image>,
  ) {}

  async getAllRollingPapers(fundUuid: string): Promise<RollingPaperDto[]> {
    const fund = await this.fundingRepo.findOne({ where: { fundUuid } });
    const rolls = await this.rollingPaperRepo.find({
      where: { fundId: fund.fundId },
      relations: ['donation', 'donation.user'],
    });

    const getImageUrl = async (roll: RollingPaper): Promise<string> => {
      if (roll.defaultImgId) {
        return (
          await this.imgRepo.findOne({
            where: { imgId: DefaultImageId.RollingPaper },
          })
        )?.imgUrl;
      }

      // not a default
      return (
        await this.imgRepo.findOne({
          where: { imgType: ImageType.RollingPaper, subId: roll.rollId },
        })
      ).imgUrl;
    };

    const resolvedRolls = await Promise.all(rolls);
    const dtoPromises = resolvedRolls.map(async (roll) => {
      const imageUrl = await getImageUrl(roll);
      return new RollingPaperDto(roll, imageUrl);
    });
    return Promise.all(dtoPromises);
  }
}
