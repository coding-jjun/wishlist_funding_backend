import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Funding } from 'src/entities/funding.entity';
import { Repository } from 'typeorm';
import { CreateFundingDto } from './dto/create-funding.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class FundingService {
  constructor(
    @InjectRepository(Funding)
    private fundingRepository: Repository<Funding>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<Funding[]> {
    return this.fundingRepository.find();
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
