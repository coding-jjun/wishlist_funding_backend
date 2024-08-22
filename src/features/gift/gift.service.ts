import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Funding } from 'src/entities/funding.entity';
import { Gift } from 'src/entities/gift.entity';
import { Repository } from 'typeorm';
import { RequestGiftDto } from './dto/request-gift.dto';
import { ResponseGiftDto } from './dto/response-gift.dto';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { ImageType } from 'src/enums/image-type.enum';
import { Image } from 'src/entities/image.entity';
import { DefaultImageIds, getRandomDefaultImgId } from 'src/enums/default-image-id';

@Injectable()
export class GiftService {
  constructor(
    @InjectRepository(Gift)
    private readonly giftRepository: Repository<Gift>,

    @InjectRepository(Funding)
    private readonly fundRepository: Repository<Funding>,

    @InjectRepository(Image)
    private readonly imgRepository: Repository<Image>,
    
    private readonly g2gException: GiftogetherExceptions,
  ) {}

  async findAllGift(
    fundId: number,
  ): Promise<{ gifts: ResponseGiftDto[]; count: number }> {
    const funding = await this.fundRepository.findOneBy({ fundId });
    if (!funding) {
      throw new HttpException(
        '존재하지 않는 펀딩입니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    const [gifts, count] = await this.giftRepository.findAndCount({
      where: { funding: { fundId } },
      relations: ['funding'],
    });

    // Gift 배열을 ResponseGiftDto 배열로 변환
    const responseGifts = gifts.map((gift) => new ResponseGiftDto(gift, ''));

    return { gifts: responseGifts, count };
  }

  async createOrUpdateGift(
    funding: Funding,
    gifts: RequestGiftDto[],
  ): Promise<ResponseGiftDto[]> {
    return Promise.all(
      gifts.map(gift => 
        gift.giftId 
          ? this.updateGift(funding, gift) 
          : this.createNewGift(funding, gift)
      )
    );
  }
  
  private async updateGift(
    funding: Funding,
    gift: RequestGiftDto,
  ): Promise<ResponseGiftDto> {
    const existGift = await this.giftRepository.findOne({
      where: { giftId: gift.giftId },
    });
  
    if (!existGift) {
      throw new Error('Gift not found');
    }
  
    // Update gift properties
    existGift.giftUrl = gift.giftUrl;
    existGift.giftOrd = gift.giftOrd;
    existGift.giftOpt = gift.giftOpt;
    existGift.giftCont = gift.giftCont;
    existGift.funding = funding;
  
    const imgUrl = gift.giftImg
      ? await this.handleGiftImageUpdate(existGift, gift.giftImg)
      : await this.handleGiftImageRemoval(existGift);
  
    const savedGift = await this.giftRepository.save(existGift);
    return new ResponseGiftDto(savedGift, imgUrl);
  }
  
  private async handleGiftImageUpdate(
    existGift: Gift,
    newGiftImgUrl: string,
  ): Promise<string> {
    if (existGift.defaultImgId) {
      existGift.defaultImgId = null; // 기본 이미지를 제거
    } else {
      // 기존 이미지를 조회
      const existImg = await this.imgRepository.findOne({
        where: {
          imgType: ImageType.Gift,
          subId: existGift.giftId,
        },
      });
  
      // 기존 이미지가 존재하고 URL이 동일한 경우, 그대로 사용
      if (existImg) {
        if (existImg.imgUrl === newGiftImgUrl) {
          return existImg.imgUrl; // 기존 URL을 그대로 반환
        }
        await this.imgRepository.delete(existImg.imgId);
      }
    }
  
    // 새로운 이미지를 저장
    const newImage = await this.saveNewImage(newGiftImgUrl, existGift.giftId);
    return newImage.imgUrl;
  }
  
  private async handleGiftImageRemoval(
    existGift: Gift,
  ): Promise<string> {
    if (existGift.defaultImgId) {
      // 기본 이미지가 이미 설정되어 있는 경우
      const defaultImage = await this.imgRepository.findOne({
        where: { imgId: existGift.defaultImgId },
      });
      return defaultImage.imgUrl;
    } else {
      // 기본 이미지가 설정되어 있지 않다면 기존 이미지를 삭제하고 기본 이미지를 설정
      await this.imgRepository.delete({
        imgType: ImageType.Gift,
        subId: existGift.giftId
      });
  
      return this.setDefaultGiftImage(existGift);
    }
  }
  
  private async createNewGift(
    funding: Funding,
    gift: RequestGiftDto,
  ): Promise<ResponseGiftDto> {
    const newGift = new Gift();
  
    newGift.giftUrl = gift.giftUrl;
    newGift.giftOrd = gift.giftOrd;
    newGift.giftOpt = gift.giftOpt;
    newGift.giftCont = gift.giftCont;
    newGift.funding = funding;

    const savedGift = await this.giftRepository.save(newGift);
  
    const imgUrl = gift.giftImg
    ? (await this.saveNewImage(gift.giftImg, savedGift.giftId)).imgUrl
    : await this.setDefaultGiftImage(savedGift);
  
    return new ResponseGiftDto(savedGift, imgUrl);
  }

  private async saveNewImage(imgUrl: string, giftId: number): Promise<Image> {
    const newImage = new Image(imgUrl, ImageType.Gift, giftId);
    return this.imgRepository.save(newImage);
  }
  
  private async setDefaultGiftImage(gift: Gift): Promise<string> {
    const defaultImgId = getRandomDefaultImgId(DefaultImageIds.Gift);
    gift.defaultImgId = defaultImgId;
  
    const defaultImage = await this.imgRepository.findOne({
      where: { imgId: defaultImgId },
    });

    await this.giftRepository.save(gift);
    return defaultImage.imgUrl;
  }

  // async updateGift(
  //   giftId: number,
  //   requestGiftDto: RequestGiftDto,
  // ): Promise<Gift> {
  //   const gift = await this.giftRepository.findOneBy({ giftId });
  //   if (!gift) {
  //     throw new HttpException(
  //       '존재하지 않는 선물입니다.',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   gift.giftUrl = requestGiftDto.giftUrl;
  //   gift.giftOrd = requestGiftDto.giftOrd;
  //   gift.giftOpt = requestGiftDto.giftOpt;
  //   gift.giftCont = requestGiftDto.giftCont;

  //   return await this.giftRepository.save(gift);
  // }

  async deleteGift(giftId: number): Promise<Gift> {
    const gift = await this.giftRepository.findOneBy({ giftId });
    if (!gift) {
      throw new HttpException(
        '존재하지 않는 선물입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.giftRepository.delete(gift);

    return gift;
  }
}
