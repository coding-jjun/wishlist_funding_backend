import { Injectable } from '@nestjs/common';
import { FundingDto } from './dto/funding.dto';
import { Funding } from 'src/entities/funding.entity';
import { ResponseGiftDto } from '../gift/dto/response-gift.dto';
import { ImageService } from '../image/image.service';
import { ImageType } from 'src/enums/image-type.enum';
import { Image } from 'src/entities/image.entity';

/**
 * Controller에서 복잡한 FundingDto 생성 로직을 추상화하기 위해 만들었습니다.
 */
@Injectable()
export class FundingDtoBuilder {
  constructor(private imgService: ImageService) {}

  async build(
    funding: Funding,
    gifts?: ResponseGiftDto[],
  ): Promise<FundingDto> {
    // fundUserImg

    const user = funding.fundUser;
    const userImg: Promise<Image> = user.defaultImgId
      ? this.imgService.getInstanceByPK(user.defaultImgId)
      : this.imgService
          .getInstancesBySubId(ImageType.User, user.userId)
          .then((v) => v[0]);

    // fundImgUrls

    const fundImgs: Promise<Image[]> = funding.defaultImgId
      ? this.imgService.getInstanceByPK(funding.defaultImgId).then((v) => [v])
      : this.imgService.getInstancesBySubId(ImageType.Funding, funding.fundId);
    const fundImgUrls: string[] = await fundImgs.then((v) =>
      v.map((i) => i.imgUrl),
    );

    // giftImgUrls

    const giftImgUrls: string[] =
      gifts && gifts.length > 0 ? gifts.map((gift) => gift.giftImg) : [];

    const f = funding;
    return new FundingDto(
      f.fundId,
      f.fundUuid,
      f.fundTitle,
      f.fundCont,
      f.fundTheme,
      f.fundPubl,
      f.fundGoal,
      f.fundSum,
      f.fundAddrRoad,
      f.fundAddrDetl,
      f.fundAddrZip,
      f.fundRecvName,
      f.fundRecvPhone,
      f.regAt,
      f.endAt,
      user.userId,
      user.userNick,
      (await userImg).imgUrl,
      [...fundImgUrls, ...giftImgUrls], //
      f.fundRecvReq,
      gifts,
    );
  }
}
