import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Funding } from 'src/entities/funding.entity';
import { Repository,Like, MoreThan } from 'typeorm';
import { CreateFundingDto } from './dto/create-funding.dto';
import { User } from 'src/entities/user.entity';
import { FundTheme } from 'src/enums/fund-theme.enum';

@Injectable()
export class FundingService {
  constructor(
    @InjectRepository(Funding)
    private fundingRepository: Repository<Funding>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(
    fundPublFilter: 'all' | 'friends' | 'both',
    fundThemes: FundTheme[],
    status: 'ongoing' | 'ended',
    sort: 'endAtAsc' | 'endAtDesc' | 'regAtAsc' | 'regAtDesc',
    limit: number,  
    lastFundId?: number, // 마지막으로 로드된 항목의 id 값
    lastEndAtDate?: Date, // 마지막으로 로드된 항목의 endAt 값
  ): Promise<Funding[]> {
    const queryBuilder = await this.fundingRepository.createQueryBuilder('funding');

    if (fundPublFilter === 'all') {
      queryBuilder.andWhere('funding.fundPubl = :publ', { publ: true });
    } else if (fundPublFilter === 'friends') {
      // 친구 공개 로직 구현 (예시 코드에는 단순화됨)
      queryBuilder.andWhere('funding.fundPubl = :publ', { publ: false });
    } 
    // else {
    //   queryBuilder.andWhere('funding.fundPubli = ')
    // }

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
        break;
      case 'endAtDesc':
        queryBuilder.orderBy('funding.endAt', 'DESC').addOrderBy('funding.fundId', 'ASC');
        break;
      case 'regAtAsc':
        queryBuilder.orderBy('funding.regAt', 'ASC').addOrderBy('funding.fundId', 'ASC');
        break;
      case 'regAtDesc':
        queryBuilder.orderBy('funding.regAt', 'DESC').addOrderBy('funding.fundId', 'ASC');
        break;
    }
    
    if (lastEndAtDate && lastFundId) {
      queryBuilder.andWhere('(funding.endAt <= :lastEndAtDate AND funding.fundId > :lastFundId)', { lastEndAtDate, lastFundId });
    }

    queryBuilder.take(limit);
    
    return queryBuilder.getMany();
  }

  findOne(fundId: number): Promise<Funding[]> {
    return this.fundingRepository.findBy({ fundId });
  }

  create(fundingCreateDto: CreateFundingDto, accessToken: string): Funding {
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

    this.fundingRepository.save(funding);
    return funding;
  }

  update(id: number, updateFundingDto) {}

  async remove(fundId: number) {
    const funding = await this.fundingRepository.findOneBy({ fundId });
    this.fundingRepository.remove(funding);
  }
}
