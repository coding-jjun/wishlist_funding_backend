import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Funding } from "src/entities/funding.entity";
import { Gift } from "src/entities/gift.entity";
import { Repository } from "typeorm";
import { CreateGiftDto } from "./dto/create-gift.dto";
import { UpdateGiftDto } from "./dto/update-gift.dto";

@Injectable()
export class GiftService {
  constructor(
    @InjectRepository(Gift)
    private readonly giftRepository: Repository<Gift>,

    @InjectRepository(Funding)
    private readonly fundingRepository: Repository<Funding>,
  ) {}

  async findAllGift(
    fundId: number
  ): Promise<{ gifts: Gift[], count: number }> {
    return
  }

  async createGift(
    fundId: number, gifts: CreateGiftDto[],
  ): Promise<Gift[]> {
    const funding = await this.fundingRepository.findOneBy({ fundId });
    if (!funding) {
      throw new HttpException(
        '존재하지 않는 펀딩입니다.', HttpStatus.BAD_REQUEST,
      )
    }
    
    // const createdGifts: Gift[] = [];
    // for (const gift of gifts) {
    //   const newGift = new Gift;

    //   newGift.giftUrl = gift.giftUrl;
    //   newGift.giftOrd = gift.giftOrd;
    //   newGift.giftOpt = gift.giftOpt;
    //   newGift.giftCont = gift.giftCont;
    //   newGift.funding = funding;

    //   const savedGift = await this.giftRepository.save(newGift);
    //   createdGifts.push(savedGift);
    // }

    // return createdGifts;

    const giftPromises = gifts.map(gift => {
      const newGift = new Gift();
      newGift.giftUrl = gift.giftUrl;
      newGift.giftOrd = gift.giftOrd;
      newGift.giftOpt = gift.giftOpt;
      newGift.giftCont = gift.giftCont;
      newGift.funding = funding;
  
      return this.giftRepository.save(newGift);
    });
  
    return Promise.all(giftPromises);
  }

  async updateGift(
    giftId: number,
    updateGiftDto: UpdateGiftDto,
  ): Promise<Gift> {
    const gift = await this.giftRepository.findOneBy({ giftId });
    if (!gift) {
      throw new HttpException(
        '존재하지 않는 선물입니다.', HttpStatus.BAD_REQUEST
      )
    }

    gift.giftUrl = updateGiftDto.giftUrl;
    gift.giftOrd = updateGiftDto.giftOrd;
    gift.giftOpt = updateGiftDto.giftOpt;
    gift.giftCont = updateGiftDto.giftCont;

    return await this.giftRepository.save(gift)
  }

  async deleteGift(
    giftId: number
  ): Promise<Gift> {
    const gift = await this.giftRepository.findOneBy({ giftId });
    if (!gift) {
      throw new HttpException(
        '존재하지 않는 선물입니다.', HttpStatus.BAD_REQUEST
      )
    }

    await this.giftRepository.softDelete(gift);

    return gift;
  }
}