import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RollingPaper } from 'src/entities/rolling-paper.entity';
import { Repository } from 'typeorm';
import { RollingPaperDto } from './dto/rolling-paper.dto';
import { Funding } from 'src/entities/funding.entity';
import { Image } from 'src/entities/image.entity';
import { ImageType } from 'src/enums/image-type.enum';
import { Donation } from 'src/entities/donation.entity';
import { CreateRollingPaperDto } from './dto/create-rolling-paper.dto';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { ValidCheck } from 'src/util/valid-check';
import { User } from 'src/entities/user.entity';
import { DefaultImageIds } from 'src/enums/default-image-id';
import { ImageService } from '../image/image.service';

@Injectable()
export class RollingPaperService {
  constructor(
    @InjectRepository(RollingPaper)
    private readonly rollingPaperRepo: Repository<RollingPaper>,

    @InjectRepository(Funding)
    private readonly fundingRepo: Repository<Funding>,

    @InjectRepository(Image)
    private readonly imgRepo: Repository<Image>,

    private readonly g2gException: GiftogetherExceptions,

    private readonly validChecker: ValidCheck,

    private readonly imgService: ImageService,
  ) {}

  async getAllRollingPapers(
    fundUuid: string,
    user: User,
  ): Promise<RollingPaperDto[]> {
    const fund = await this.fundingRepo.findOne({
      where: { fundUuid },
      relations: ['fundUser'],
    });
    if (!fund) throw this.g2gException.FundingNotExists;

    // 펀딩 완료시에 호출 가능하도록
    if (fund.endAt < new Date(Date.now())) {
      throw this.g2gException.FundingNotClosed;
    }

    // fund 개설자만이 rollingPaper를 볼 수 있습니다.
    await this.validChecker.verifyUserMatch(fund.fundUser.userId, user.userId);

    const rolls = await this.rollingPaperRepo.find({
      where: { fundId: fund.fundId },
      relations: ['donation', 'donation.user'],
    });

    const getImageUrl = async (roll: RollingPaper): Promise<string> => {
      if (roll.defaultImgId) {
        return (
          await this.imgRepo.findOne({
            where: { imgId: roll.defaultImgId },
          })
        )?.imgUrl;
      }

      // not a default
      Logger.log(`롤링페이퍼 ID: ${roll.rollId}`);
      return (
        await this.imgRepo.findOne({
          where: { imgType: ImageType.RollingPaper, subId: roll.rollId },
        })
      )?.imgUrl;
    };

    const resolvedRolls = await Promise.all(rolls);
    const dtoPromises = resolvedRolls.map(async (roll) => {
      const imageUrl = await getImageUrl(roll);
      return new RollingPaperDto(roll, imageUrl);
    });
    return Promise.all(dtoPromises);
  }

  /**
   * DonationService.createDonation시에 동시에 같이 생성이 되는 메서드입니다.
   * 따라서 별개의 컨트롤러는 없고 오직 DonationService에 의해서 호출됩니다.
   * @param fundUuid
   */
  async createRollingPaper(
    fundId: number,
    donation: Donation,
    crpDto: CreateRollingPaperDto,
    user: User,
  ): Promise<RollingPaper> {
    const rollingPaper = new RollingPaper();
    rollingPaper.rollId = donation.donId;
    rollingPaper.donation = donation;
    rollingPaper.rollMsg = crpDto.rollMsg;
    rollingPaper.fundId = fundId;

    const savedRp = await this.rollingPaperRepo.save(rollingPaper);

    if (crpDto.rollImg) {
      // 사용자 정의 이미지
      this.imgService.save(
        crpDto.rollImg,
        user,
        ImageType.RollingPaper,
        rollingPaper.rollId,
      );
    } else {
      // 기본값 이미지
      if (
        !crpDto.defaultImgId ||
        !DefaultImageIds.RollingPaper.includes(crpDto.defaultImgId)
      )
        throw this.g2gException.DefaultImgIdNotExist;

      this.rollingPaperRepo.update(savedRp.rollId, {
        defaultImgId: crpDto.defaultImgId,
      });
    }

    return savedRp;
  }
}
