import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Funding } from 'src/entities/funding.entity';
import { Repository } from 'typeorm';
import { CreateFundingDto } from './dto/create-funding.dto';
import { User } from 'src/entities/user.entity';
import { UpdateFundingDto } from './dto/update-funding.dto';

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

  async update(id: number, updateFundingDto: UpdateFundingDto): Promise<Funding> {
    const { fundTitle, fundCont, fundImg, fundTheme, endAt } = updateFundingDto;
    const funding = await this.fundingRepository.findOne({
      where: { fundId: id },
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
      throw new HttpException(
        'endAt property should not go backward!!',
        HttpStatus.BAD_REQUEST,
      );
    }
    funding.endAt = endAt;

    this.fundingRepository.save(funding);

    return funding;
  }

  async remove(fundId: number) {
    const funding = await this.fundingRepository.findOneBy({ fundId });
    this.fundingRepository.remove(funding);
  }
}
