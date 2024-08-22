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
    const giftPromises = gifts.map(async (gift) => {
      let savedGift: Gift;
      let imgUrl = '';

      if (gift.giftId) {
        // giftId가 있는 경우 해당 Gift를 업데이트
        const existGift = await this.giftRepository.findOne({
          where: { giftId: gift.giftId },
        });

        if (existGift) {
          existGift.giftUrl = gift.giftUrl;
          existGift.giftOrd = gift.giftOrd;
          existGift.giftOpt = gift.giftOpt;
          existGift.giftCont = gift.giftCont;
          existGift.funding = funding;

          if (gift.giftImg) {
            if (!existGift.defaultImgId) {  
              const existImg = await this.imgRepository.findOne({
                where: {
                  imgType: ImageType.Gift,
                  subId: existGift.giftId,
                }
              });
              if (existImg) {
                // 기존에 등록된 이미지가 있는 경우          
                if (existImg.imgUrl !== gift.giftImg) {  
                  // 기존 이미자와 URL이 똑같지 않다면
                  await this.imgRepository.delete(existImg.imgId);
                  
                  const image = new Image(gift.giftImg, ImageType.Funding, gift.giftId)
                  const savedImg = await this.imgRepository.save(image);
                  imgUrl = savedImg.imgUrl;
                } else {
                  imgUrl = gift.giftUrl;
                }
              } else {
                // 기존에 등록된 이미지가 없는 경우
                const image = new Image(gift.giftImg, ImageType.Funding, gift.giftId)
                const savedImg = await this.imgRepository.save(image);
                imgUrl = savedImg.imgUrl;
              }
            } else {
              // 기존에 등록된 이미지가 없는 경우
              const image = new Image(gift.giftImg, ImageType.Funding, gift.giftId)
              const savedImg = await this.imgRepository.save(image);

              existGift.defaultImgId = null;
              imgUrl = savedImg.imgUrl;
            }
          } else {
            // 등록할 이미지가 없는 경우
            if (!existGift.defaultImgId) {           
              const existImg = await this.imgRepository.findOne({
                where: {
                  imgType: ImageType.Gift,
                  subId: existGift.giftId,
                }
              });
              if (existImg) {
                // 기존에 등록된 이미지가 있는 경우
                await this.imgRepository.delete(existImg.imgId);
              }
            }
            const defaultImgId = getRandomDefaultImgId(DefaultImageIds.Gift);
            existGift.defaultImgId = defaultImgId;

            const defaultImage = await this.imgRepository.findOne({
              where: { imgId: defaultImgId},
            });

            imgUrl = defaultImage.imgUrl;
          }
          savedGift = await this.giftRepository.save(existGift);
        }
      } else {
        // giftId가 없거나 기존 Gift를 찾지 못한 경우 새로운 Gift 생성
        savedGift = await this.createGift(funding, gift);
        if (gift.giftImg) {
          imgUrl = gift.giftImg
        } else {
          const defaultImgId = getRandomDefaultImgId(DefaultImageIds.Gift);
          const defaultImage = await this.imgRepository.findOne({
            where: { imgId: defaultImgId },
          });

          imgUrl = defaultImage.imgUrl;
        }
      }

      return new ResponseGiftDto(savedGift, imgUrl);
    });

    return Promise.all(giftPromises);
  }

  private async createGift(
    funding: Funding,
    gift: RequestGiftDto,
  ): Promise<Gift> {
    const newGift = new Gift();

    newGift.giftUrl = gift.giftUrl;
    newGift.giftOrd = gift.giftOrd;
    newGift.giftOpt = gift.giftOpt;
    newGift.giftCont = gift.giftCont;
    newGift.funding = funding;

    if (gift.giftImg) {
      const image = new Image(gift.giftImg, ImageType.Funding, gift.giftId)
      await this.imgRepository.save(image);
    } else {
      newGift.defaultImgId = getRandomDefaultImgId(DefaultImageIds.Gift);
    }

    return this.giftRepository.save(newGift);
  }

  async updateGift(
    giftId: number,
    requestGiftDto: RequestGiftDto,
  ): Promise<Gift> {
    const gift = await this.giftRepository.findOneBy({ giftId });
    if (!gift) {
      throw new HttpException(
        '존재하지 않는 선물입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    gift.giftUrl = requestGiftDto.giftUrl;
    gift.giftOrd = requestGiftDto.giftOrd;
    gift.giftOpt = requestGiftDto.giftOpt;
    gift.giftCont = requestGiftDto.giftCont;

    return await this.giftRepository.save(gift);
  }

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
