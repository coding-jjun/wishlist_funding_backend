import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Funding } from 'src/entities/funding.entity';
import { Repository, Brackets } from 'typeorm';
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
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { ValidCheck } from 'src/util/valid-check';
import {
  DefaultImageIds,
  getRandomDefaultImgId,
} from 'src/enums/default-image-id';
import { ImageService } from '../image/image.service';

@Injectable()
export class FundingService {
  constructor(
    @InjectRepository(Funding)
    private fundingRepository: Repository<Funding>,

    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,

    private imgService: ImageService,

    private giftService: GiftService,

    private readonly g2gException: GiftogetherExceptions,

    private readonly validCheck: ValidCheck,
  ) { }

  async findFundingByUuidAndUserId(
    fundUuid: string,
    userId: number,
  ): Promise<Funding> {
    const funding = await this.fundingRepository.findOne({
      relations: {
        fundUser: true,
        gifts: true,
      },
      where: { fundUuid },
    });
    if (!funding) {
      throw this.g2gException.FundingNotExists;
    }
    await this.validCheck.verifyUserMatch(funding.fundUser.userId, userId);
    return funding;
  }

  async findAll(
    userId: number,
    fundPublFilter: 'all' | 'friends' | 'both' | 'mine',
    fundThemes: FundTheme[],
    status: 'ongoing' | 'ended',
    sort: 'endAtAsc' | 'endAtDesc' | 'regAtAsc' | 'regAtDesc',
    limit: number,
    lastFundUuid?: string, // 마지막으로 로드된 항목의 id 값
    lastEndAtDate?: Date, // 마지막으로 로드된 항목의 endAt 값
    user?: User,
  ): Promise<{
    fundings: FundingDto[];
    count: number;
    lastFundUuid: string;
    lastEndAt: Date;
  }> {
    let lastFundId;
    if (lastFundUuid) {
      const lastFund = await this.fundingRepository.findOne({
        where: { fundUuid: lastFundUuid },
      });
      if (lastFund) {
        lastFundId = lastFund.fundId;
      }
    }

    const queryBuilder =
      await this.fundingRepository.createQueryBuilder('funding');

    if (fundPublFilter === 'mine') {
      queryBuilder.where('funding.fundUser = :userId', { userId });

      if (user.userId != userId) {
        const friendship = await this.friendRepository
          .createQueryBuilder('friend')
          .where(
            '((friend.userId = :userId AND friend.friendId = :friendId) OR (friend.userId = :friendId AND friend.friendId = :userId))',
            { userId: user.userId, friendId: userId })
          .andWhere('friend.status = :status', { status: FriendStatus.Friend })
          .getOne();

        if (!friendship) {
          queryBuilder.andWhere(
            'fund.fundPubl = :publ',
            { publ: true }
          )
        }
      }
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
      queryBuilder.andWhere('funding.endAt >= :now', { now: currentDate });
    } else if (status === 'ended') {
      queryBuilder.andWhere('funding.endAt < :now', { now: currentDate });
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

    queryBuilder.leftJoinAndSelect('funding.fundUser', 'user');
    // .leftJoinAndSelect('user.image', 'img');

    const fundings = (await queryBuilder.getMany()).map(
      (funding) => new FundingDto(funding),
    );

    return {
      fundings: fundings,
      count: fundings.length,
      lastFundUuid: fundings[fundings.length - 1]?.fundUuid,
      lastEndAt:
        sort[0] === 'e'
          ? fundings[fundings.length - 1]?.endAt
          : fundings[fundings.length - 1]?.regAt,
    };
  }

  async findOne(fundUuid: string): Promise<FundingDto> {
    const fund = await this.fundingRepository.findOne({
      relations: { fundUser: true },
      where: { fundUuid },
    });

    if (!fund) {
      throw this.g2gException.FundingNotExists;
    }

    const { gifts, fundImgUrls } = await this.giftService.findAllGift(fund);

    let finalImgUrls: string[] = [];

    if (fund.defaultImgId) {
      // 펀딩의 기본 이미지가 있을 경우, 그 이미지를 추가
      const img = await this.imgService.getInstanceByPK(fund.defaultImgId);

      if (img) {
        finalImgUrls = [img.imgUrl, ...fundImgUrls]; // 펀딩 기본 이미지 + gift 이미지들
      }
    } else {
      // 펀딩의 기본 이미지가 없을 경우, 펀딩과 연결된 다른 이미지들을 추가
      const images = await this.imgService.getInstancesBySubId(
        ImageType.Funding,
        fund.fundId,
      );

      finalImgUrls = [...images.map((img) => img.imgUrl), ...fundImgUrls]; // 펀딩의 이미지 + gift 이미지들
    }

    // FundingDto에 펀딩 이미지와 gift 이미지 URL들을 포함하여 반환
    return new FundingDto(fund, gifts, finalImgUrls);
  }

  async create(
    createFundingDto: CreateFundingDto,
    user: User,
  ): Promise<FundingDto> {
    // TODO - accessToken -> User 객체로 변환하기
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

    let fundImg: string[] = [];
    if (createFundingDto.fundImg) {
      // subId = fundId, imgType = "Funding" Image 객체를 만든다.
      const fundImgUrls = [createFundingDto.fundImg]; // TODO - CreateFundingDto.fundImg -> fundImgUrls 로 변경하기
      const fundImgPromises = fundImgUrls.map((url) =>
        this.imgService.save(url, user, ImageType.Funding, funding_save.fundId),
      );
      const images = await Promise.all(fundImgPromises);
      fundImg.push(...images.map((i) => i.imgUrl));
    } else {
      const defaultImgId = getRandomDefaultImgId(DefaultImageIds.Funding);
      await this.fundingRepository.update(funding_save.fundId, {
        defaultImgId,
      });
      const image = await this.imgService.getInstanceByPK(defaultImgId);
      if (image) {
        fundImg.push(image.imgUrl);
      }
    }

    const gifts = await this.giftService.createOrUpdateGift(
      funding_save,
      createFundingDto.gifts,
      user,
    );

    return new FundingDto(funding_save, gifts, fundImg);
  }

  async update(
    fundUuid: string,
    updateFundingDto: UpdateFundingDto,
    user: User,
  ): Promise<FundingDto> {
    const funding = await this.findFundingByUuidAndUserId(fundUuid, user.userId);
    const fundId = funding.fundId;

    // endAt이 앞당겨지면 안된다.
    if (funding.endAt > updateFundingDto.endAt) {
      Logger.log(
        `funding.endAt: ${JSON.stringify(JSON.stringify(funding.endAt))}, endAt: ${JSON.stringify(updateFundingDto.endAt)}`,
      );
      throw this.g2gException.EndDatePast;
    }

    // 이미지 업데이트
    const fundingImg = await this.updateFundingImage(funding, updateFundingDto.fundImg, fundId, user);

    // Funding 업데이트
    await this.fundingRepository.update(
      { fundId },
      {
        ...updateFundingDto,
        defaultImgId: funding.defaultImgId,
      },
    );

    const { gifts, fundImgUrls } = await this.giftService.findAllGift(funding);
    const finalImgUrls = [fundingImg, ...fundImgUrls];

    return new FundingDto(funding, gifts, finalImgUrls);
  }

  private async updateFundingImage(
    funding: Funding,
    fundImg: string | undefined,
    fundId: number,
    user: User,
  ): Promise<string> {
    if (fundImg) {
      // 지정한 funding 이미지가 존재할 때
      if (funding.defaultImgId) {
        // 기본 이미지를 사용 중이었을 경우 새로운 이미지로 교체
        await this.imgService.save(fundImg, user, ImageType.Funding, fundId);
        funding.defaultImgId = null; // 기본 이미지를 해제
        return fundImg;
      } else {
        // 기존 지정 이미지가 존재하는 경우
        const existImg = (
          await this.imgService.getInstancesBySubId(ImageType.Funding, fundId)
        )[0];

        if (existImg && existImg.imgUrl !== fundImg) {
          // 기존 이미지의 URL과 다르면 업데이트
          await this.imgService.delete(ImageType.Funding, fundId);
          await this.imgService.save(fundImg, user, ImageType.Funding, fundId);
        }
        return fundImg;
      }
    } else {
      // 지정한 funding 이미지가 없을 때
      if (funding.defaultImgId) {
        // 기본 이미지가 설정된 경우 기본 이미지를 반환
        const defaultImg = await this.imgService.getInstanceByPK(
          funding.defaultImgId,
        );
        return defaultImg?.imgUrl || '';
      } else {
        // 기존 지정 이미지를 사용 중이었으나 삭제 후 기본 이미지 설정
        await this.imgService.delete(ImageType.Funding, fundId);
        const randomId = getRandomDefaultImgId(DefaultImageIds.Funding);
        funding.defaultImgId = randomId;
        const defaultImg = await this.imgService.getInstanceByPK(randomId);
        return defaultImg?.imgUrl || '';
      }
    }
  }

  async remove(fundUuid: string, userId: number): Promise<void> {
    const funding = await this.findFundingByUuidAndUserId(fundUuid, userId);
    // 펀딩과 연관된 이미지를 unlink하고 삭제한다.
    await this.imgService.delete(ImageType.Funding, funding.fundId);
    // 선물과 연관된 이미지를 unlink하고 삭제한다.
    const gifts = funding.gifts;
    await this.giftService.delete(...gifts);
    this.fundingRepository.remove(funding);
  }
}
