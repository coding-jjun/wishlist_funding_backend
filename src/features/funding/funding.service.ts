import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Funding } from 'src/entities/funding.entity';
import { Repository, Like, MoreThan, Brackets } from 'typeorm';
import { CreateFundingDto } from './dto/create-funding.dto';
import { User } from 'src/entities/user.entity';
import { FundTheme } from 'src/enums/fund-theme.enum';
import { FriendStatus } from 'src/enums/friend-status.enum';
import { Friend } from 'src/entities/friend.entity';
import { GiftService } from '../gift/gift.service';
import { FundingDto } from './dto/funding.dto';
import { UpdateFundingDto } from './dto/update-funding.dto';
import { Image } from 'src/entities/image.entity';
import { ImageType } from 'src/enums/image-type.enum';
import { DefaultImageId } from 'src/enums/default-image-id';
import { query } from 'express';

@Injectable()
export class FundingService {
  constructor(
    @InjectRepository(Funding)
    private fundingRepository: Repository<Funding>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,

    @InjectRepository(Image)
    private imageRepository: Repository<Image>,

    private giftService: GiftService,
  ) {}

  async findAll(
    userId: number,
    fundPublFilter: 'all' | 'friends' | 'both' | 'mine',
    fundThemes: FundTheme[],
    status: 'ongoing' | 'ended',
    sort: 'endAtAsc' | 'endAtDesc' | 'regAtAsc' | 'regAtDesc',
    limit: number,
    lastFundId?: number, // 마지막으로 로드된 항목의 id 값
    lastEndAtDate?: Date, // 마지막으로 로드된 항목의 endAt 값
  ): Promise<{ fundings: FundingDto[]; count: number; lastFundId: number, lastEndAt: Date }> {
    const queryBuilder =
      await this.fundingRepository.createQueryBuilder('funding');

    if (fundPublFilter === 'mine') {
      queryBuilder.where('funding.fundUser = :userId', { userId });
    } else {
      queryBuilder.where('funding.fundUser != :userId', { userId });

      const friendIds = await this.friendRepository
        .createQueryBuilder('friend')
        .where('friend.status = :status', { status: FriendStatus.Friend })
        .andWhere(
          new Brackets((qb) => {
            qb.where('friend.userId = :userId', { userId }).orWhere(
              'friend.friendId = :userId',
              { userId },
            );
          }),
        )
        .select(
          'CASE WHEN friend.userId = :userId THEN friend.friendId ELSE friend.userId END',
          'friendId',
        )
        .setParameter('userId', userId)
        .getRawMany();

      const friendIdsArray = friendIds.map((friend) => friend.friendId);

      if (friendIdsArray.length > 0) {
        // 친구 목록이 있는 경우
        if (fundPublFilter === 'all') {
          queryBuilder.andWhere(
            'funding.fundPubl = :publ AND funding.fundUser NOT IN (:...ids)',
            { publ: true, ids: friendIdsArray },
          );
        } else if (fundPublFilter === 'friends') {
          queryBuilder.andWhere('funding.fundUser IN (:...ids)', {
            ids: friendIdsArray,
          });
        } else if (fundPublFilter === 'both') {
          queryBuilder.andWhere(
            '(funding.fundPubl = :publ OR funding.fundUser IN (:...ids))',
            { publ: true, ids: friendIdsArray },
          );
        }
      } else {
        // 친구 목록이 비어 있는 경우
        if (fundPublFilter === 'all') {
          queryBuilder.andWhere('funding.fundPubl = :publ', { publ: true });
        } else if (fundPublFilter === 'friends') {
          // 친구가 없으면 친구에 의한 펀딩은 결과 없음
          queryBuilder.andWhere('1=0');
        } else if (fundPublFilter === 'both') {
          // 친구가 없어도 공개 펀딩은 조회
          queryBuilder.andWhere('funding.fundPubl = :publ', { publ: true });
        }
      }
    }

    if (fundThemes && fundThemes.length > 0) {
      queryBuilder.andWhere('funding.fundTheme IN (:...themes)', {
        themes: fundThemes,
      });
    }

    const currentDate = new Date();
    if (status === 'ongoing') {
      queryBuilder.andWhere('funding.endAt > :now', { now: currentDate });
    } else if (status === 'ended') {
      queryBuilder.andWhere('funding.endAt <= :now', { now: currentDate });
    }

    switch (sort) {
      case 'endAtAsc':
        queryBuilder
          .orderBy('funding.endAt', 'ASC')
          .addOrderBy('funding.fundId', 'ASC');
        if (lastEndAtDate && lastFundId) {
          queryBuilder.andWhere(
            '(funding.endAt > :lastEndAtDate OR (funding.endAt = :lastEndAtDate AND funding.fundId > :lastFundId))',
            { lastEndAtDate, lastFundId },
          );
        }
        break;
      case 'endAtDesc':
        queryBuilder
          .orderBy('funding.endAt', 'DESC')
          .addOrderBy('funding.fundId', 'ASC');
        if (lastEndAtDate && lastFundId) {
          queryBuilder.andWhere(
            '(funding.endAt < :lastEndAtDate OR (funding.endAt = :lastEndAtDate And funding.fundId > :lastFundId))',
            { lastEndAtDate, lastFundId },
          );
        }
        break;
      case 'regAtAsc':
        queryBuilder
          .orderBy('funding.regAt', 'ASC')
          .addOrderBy('funding.fundId', 'ASC');
        if (lastEndAtDate && lastFundId) {
          queryBuilder.andWhere(
            '(funding.regAt > :lastEndAtDate OR (funding.regAt = :lastEndAtDate AND funding.fundId > :lastFundId))',
            { lastEndAtDate, lastFundId },
          );
        }
        break;
      case 'regAtDesc':
        queryBuilder
          .orderBy('funding.regAt', 'DESC')
          .addOrderBy('funding.fundId', 'ASC');
        if (lastEndAtDate && lastFundId) {
          queryBuilder.andWhere(
            '(funding.regAt < :lastEndAtDate OR (funding.regAt = :lastEndAtDate AND funding.fundId > :lastFundId))',
            { lastEndAtDate, lastFundId },
          );
        }
        break;
    }
    
    queryBuilder.take(limit);
    
    queryBuilder
      .leftJoinAndSelect('funding.fundUser', 'user')
      // .leftJoinAndSelect('user.image', 'img');
    
    const fundings = (await queryBuilder.getMany()).map(funding => new FundingDto(funding));

    return {
      fundings: fundings,
      count: fundings.length,
      lastFundId: fundings[fundings.length - 1]?.fundId,
      lastEndAt: sort[0] === "e" ? fundings[fundings.length - 1]?.endAt : fundings[fundings.length - 1]?.regAt
    };
  }

  async findOne(fundUuid: string): Promise<FundingDto> {
    const fund = await this.fundingRepository.findOne({
      relations: { fundUser: true },
      where: { fundUuid },
    });
    const gifts = (await this.giftService.findAllGift(fund.fundId)).gifts;

    if (fund.defaultImgId) {
      // fund 기본 이미지로 DTO를 생성한다.
      const img = await this.imageRepository.findOne({
        where: { imgId: DefaultImageId.Funding },
      });

      return new FundingDto(fund, gifts, [img.imgUrl]);
    }

    const images = await this.imageRepository.find({
      where: { imgType: ImageType.Funding, subId: fund.fundId },
    });

    return new FundingDto(
      fund,
      gifts,
      images.map((img) => img.imgUrl),
    );
  }

  // async findMyFunds(
  //   userId: number,
  // ): Promise<any> {
  //   const fundings = await this.fundingRepository
  //   .createQueryBuilder('funding')
  //   .where('funding.fundUser = :userId', { userId })
  //   .andWhere('funding.endAt > :now', { now: new Date() })
  //   .getMany();

  //   return fundings;
  // }

  async create(
    createFundingDto: CreateFundingDto,
    accessToken: string,
  ): Promise<FundingDto> {
    // TODO - accessToken -> User 객체로 변환하기
    const users = await this.userRepository.find();
    const user = users[0];
    let funding = new Funding(
      user,
      createFundingDto.fundTitle,
      createFundingDto.fundCont,
      createFundingDto.fundGoal,
      createFundingDto.endAt,
      createFundingDto.fundTheme,
      createFundingDto.fundAddrRoad,
      createFundingDto.fundAddrDetl,
      createFundingDto.fundAddrZip,
      createFundingDto.fundRecvName || user.userName,
      createFundingDto.fundRecvPhone || user.userPhone,
      createFundingDto.fundRecvReq,
      createFundingDto.fundPubl,
    );

    const funding_save = await this.fundingRepository.save(funding);

    if (createFundingDto.fundImg.length > 0) {
      // subId = fundId, imgType = "Funding" Image 객체를 만든다.
      const images = createFundingDto.fundImg.map(
        (url) => new Image(url, ImageType.Funding, funding_save.fundId),
      );

      this.imageRepository.save(images);
    } else {
      // defaultImgId 필드에 funding 기본 이미지 ID를 넣는다.
      await this.fundingRepository.update(funding_save.fundId, {
        defaultImgId: DefaultImageId.Funding,
      });
    }

    const gifts = await this.giftService.createOrUpdateGift(
      funding.fundId,
      createFundingDto.gifts,
    );

    // Something Changed!

    return new FundingDto(funding_save, gifts);
  }

  async update(
    fundUuid: string,
    updateFundingDto: UpdateFundingDto,
  ): Promise<FundingDto> {
    Logger.log(updateFundingDto);
    const { fundTitle, fundCont, fundImg, fundTheme, endAt } = updateFundingDto;
    const funding = await this.fundingRepository.findOne({
      relations: {
        fundUser: true,
      },
      where: { fundUuid },
    });
    if (!funding) {
      throw new HttpException('funding not found!', HttpStatus.NOT_FOUND);
    }

    funding.fundTitle = fundTitle;
    funding.fundCont = fundCont;
    // funding.fundImg = fundImg; // TODO - add relation on funding.entity
    funding.fundTheme = fundTheme;

    // endAt이 앞당겨지면 안된다.
    if (funding.endAt > endAt) {
      Logger.log(
        `funding.endAt: ${JSON.stringify(JSON.stringify(funding.endAt))}, endAt: ${JSON.stringify(endAt)}`,
      );
      throw new HttpException(
        'endAt property should not go backward!!',
        HttpStatus.BAD_REQUEST,
      );
    }
    funding.endAt = endAt;

    await this.fundingRepository.save(funding);

    // let gifts = await this.giftService.createGift(funding.fundId, updateFundingDto.gifts ?? []);

    const { gifts, count } = await this.giftService.findAllGift(funding.fundId);

    return new FundingDto(funding, gifts);
  }

  async remove(fundUuid: string): Promise<void> {
    const funding = await this.fundingRepository.findOneBy({ fundUuid });
    this.fundingRepository.remove(funding);
  }
}
