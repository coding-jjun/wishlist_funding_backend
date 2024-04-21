import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Funding } from 'src/entities/funding.entity';
import { Repository,Like, MoreThan, Brackets } from 'typeorm';
import { CreateFundingDto } from './dto/create-funding.dto';
import { User } from 'src/entities/user.entity';
import { FundTheme } from 'src/enums/fund-theme.enum';
import { FriendStatus } from 'src/enums/friend-status.enum';
import { Friend } from 'src/entities/friend.entity';

@Injectable()
export class FundingService {
  constructor(
    @InjectRepository(Funding)
    private fundingRepository: Repository<Funding>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
    
    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,
  ) {}

  async findAll(
    userId: number,
    fundPublFilter: 'all' | 'friends' | 'both',
    fundThemes: FundTheme[],
    status: 'ongoing' | 'ended',
    sort: 'endAtAsc' | 'endAtDesc' | 'regAtAsc' | 'regAtDesc',
    limit: number,  
    lastFundId?: number, // 마지막으로 로드된 항목의 id 값
    lastEndAtDate?: Date, // 마지막으로 로드된 항목의 endAt 값
  ): Promise<{ fundings: Funding[], count: number, lastFundId: number}> {
    const queryBuilder = await this.fundingRepository.createQueryBuilder('funding');

    const friendIds = await this.friendRepository.createQueryBuilder('friend')
    .where('friend.status = :status', { status: FriendStatus.Friend })
    .andWhere(new Brackets(qb => {
      qb.where('friend.userId = :userId', { userId })
        .orWhere('friend.friendId = :userId', { userId });
    }))
    .select('CASE WHEN friend.userId = :userId THEN friend.friendId ELSE friend.userId END', 'friendId')
    .setParameter('userId', userId)
    .getRawMany();

    const friendIdsArray = friendIds.map(friend => friend.friendId);

    if (friendIdsArray.length > 0) { // 친구 목록이 있는 경우
      if (fundPublFilter === 'all') {
          queryBuilder.andWhere('funding.fundPubl = :publ AND funding.fundUser NOT IN (:...ids)', { publ: true, ids: friendIdsArray });
      } else if (fundPublFilter === 'friends') {
          queryBuilder.andWhere('funding.fundUser IN (:...ids)', { ids: friendIdsArray });
      } else if (fundPublFilter === 'both') {
          queryBuilder.andWhere('(funding.fundPubl = :publ OR funding.fundUser IN (:...ids))', { publ: true, ids: friendIdsArray });
      }
    } else { // 친구 목록이 비어 있는 경우
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

    if (fundThemes && fundThemes.length > 0) {
      queryBuilder.andWhere('funding.fundTheme IN (:...themes)', { themes: fundThemes });
    }

    const currentDate = new Date();
    if (status === 'ongoing') {
      queryBuilder.andWhere('funding.endAt > :now', { now: currentDate });
    } else if (status === 'ended') {
      queryBuilder.andWhere('funding.endAt <= :now', { now: currentDate });
    }

    switch (sort) {
      case 'endAtAsc':
        queryBuilder.orderBy('funding.endAt', 'ASC').addOrderBy('funding.fundId', 'ASC');
        if (lastEndAtDate && lastFundId) {
          queryBuilder.andWhere('(funding.endAt > :lastEndAtDate OR (funding.endAt = :lastEndAtDate AND funding.fundId > :lastFundId))', { lastEndAtDate, lastFundId });
        }
        break;
      case 'endAtDesc':
        queryBuilder.orderBy('funding.endAt', 'DESC').addOrderBy('funding.fundId', 'ASC');
        if (lastEndAtDate && lastFundId) {
          queryBuilder.andWhere('(funding.endAt < :lastEndAtDate OR (funding.endAt = :lastEndAtDate And funding.fundId > :lastFundId))', { lastEndAtDate, lastFundId });
        }
        break;
      case 'regAtAsc':
        queryBuilder.orderBy('funding.regAt', 'ASC').addOrderBy('funding.fundId', 'ASC');
        if (lastEndAtDate && lastFundId) {
          queryBuilder.andWhere('(funding.regAt > :lastEndAtDate OR (funding.regAt = :lastEndAtDate AND funding.fundId > :lastFundId))', { lastEndAtDate, lastFundId });
        }
        break;
      case 'regAtDesc':
        queryBuilder.orderBy('funding.regAt', 'DESC').addOrderBy('funding.fundId', 'ASC');
        if (lastEndAtDate && lastFundId) {
          queryBuilder.andWhere('(funding.regAt < :lastEndAtDate OR (funding.regAt = :lastEndAtDate AND funding.fundId > :lastFundId))', { lastEndAtDate, lastFundId });
        }
        break;
    }

    queryBuilder.take(limit);
    const fundings = await queryBuilder.getMany();

    return {
      fundings: fundings,
      count: fundings.length,
      lastFundId: fundings[fundings.length - 1]?.fundId,
    };
  }

  findOne(fundUuid: string): Promise<Funding> {
    return this.fundingRepository.findOne({
      where: {
        fundUuid
      }
    });
  }

  create(fundingCreateDto: CreateFundingDto, accessToken: string): Promise<Funding> {
    // TODO - accessToken -> User 객체로 변환하기
    const user = this.userRepository.find()[0];
    let funding = new Funding(
      user,
      fundingCreateDto.fundTitle,
      fundingCreateDto.fundCont,
      fundingCreateDto.fundGoal,
      fundingCreateDto.endAt,
      fundingCreateDto.fundTheme,
      fundingCreateDto.fundPubl,
    );

    return this.fundingRepository.save(funding);
  }

  update(id: number, updateFundingDto) {}

  async remove(fundId: number) {
    const funding = await this.fundingRepository.findOneBy({ fundId });
    this.fundingRepository.remove(funding);
  }
}
