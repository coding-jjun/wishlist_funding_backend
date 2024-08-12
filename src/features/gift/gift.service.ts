import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Funding } from 'src/entities/funding.entity';
import { Gift } from 'src/entities/gift.entity';
import { Repository } from 'typeorm';
import { RequestGiftDto } from './dto/request-gift.dto';
import { ResponseGiftDto } from './dto/response-gift.dto';
import { isURL } from 'class-validator';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';

@Injectable()
export class GiftService {
  constructor(
    @InjectRepository(Gift)
    private readonly giftRepository: Repository<Gift>,

    @InjectRepository(Funding)
    private readonly fundingRepository: Repository<Funding>,

    private readonly g2gException: GiftogetherExceptions,
  ) {}

  async findAllGift(
    fundId: number,
  ): Promise<{ gifts: ResponseGiftDto[]; count: number }> {
    const funding = await this.fundingRepository.findOneBy({ fundId });
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
    const responseGifts = gifts.map((gift) => new ResponseGiftDto(gift));

    return { gifts: responseGifts, count };
  }

  async createOrUpdateGift(
    fundId: number,
    gifts: RequestGiftDto[],
  ): Promise<ResponseGiftDto[]> {
    const funding = await this.fundingRepository.findOneBy({ fundId });
    if (!funding) {
      throw new HttpException(
        '존재하지 않는 펀딩입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const giftPromises = gifts.map(async (gift) => {
      let savedGift: Gift;

      if (gift.giftId) {
        // giftId가 있는 경우 해당 Gift를 업데이트
        const existingGift = await this.giftRepository.findOne({
          where: { giftId: gift.giftId },
        });
        if (existingGift) {
          existingGift.giftUrl = gift.giftUrl;
          existingGift.giftOrd = gift.giftOrd;
          existingGift.giftOpt = gift.giftOpt;
          existingGift.giftCont = gift.giftCont;
          existingGift.funding = funding;
          savedGift = await this.giftRepository.save(existingGift);
        } else {
          savedGift = await this.createNewGift(funding, gift);
        }
      } else {
        // giftId가 없거나 기존 Gift를 찾지 못한 경우 새로운 Gift 생성
        savedGift = await this.createNewGift(funding, gift);
      }

      return new ResponseGiftDto(savedGift);
    });

    return Promise.all(giftPromises);
  }

  private async createNewGift(
    funding: Funding,
    gift: RequestGiftDto,
  ): Promise<Gift> {
    const newGift = new Gift();

    newGift.giftUrl = gift.giftUrl;
    newGift.giftOrd = gift.giftOrd;
    newGift.giftOpt = gift.giftOpt;
    newGift.giftCont = gift.giftCont;
    newGift.funding = funding;
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
