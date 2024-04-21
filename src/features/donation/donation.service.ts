import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Donation } from 'src/entities/donation.entity';
import { RollingPaper } from 'src/entities/rolling-paper.entity';
import { CreateDonationDto } from './dto/create-donation.dto';
import { CreateGuestDto } from './dto/create-guest.dto';
import { Funding } from 'src/entities/funding.entity';
import { User } from 'src/entities/user.entity';
import { ResponseDonationDTO } from './dto/response-donation.dto';

@Injectable()
export class DonationService {
  constructor(
    @InjectRepository(Donation)
    private readonly donationRepo: Repository<Donation>,

    @InjectRepository(RollingPaper)
    private readonly rollingPaperRepo: Repository<RollingPaper>,

    @InjectRepository(Funding)
    private readonly fundingRepo: Repository<Funding>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    
    // private readonly imgService : ImageService
  ) {}

  async getAllDonations(): Promise<Donation[]> {
    const userId = 1
    // TODO: donation paging 처리
    const result = await this.donationRepo
      .createQueryBuilder('d')
      .leftJoinAndSelect('d.funding', 'f')
      .leftJoinAndSelect('d.user', 'u')
      .select([
        'd.donId',
        'd.orderId',
        'd.donAmnt',
        'd.regAt',
        'f.fundId'
      ])
      .where('u.userId = :userId', { userId })
      .getMany();
    return result;
  }

  async getOneDonation(orderId: string) {
    const result = await this.donationRepo
      .createQueryBuilder('d')
      .leftJoinAndSelect('d.funding', 'f')
      .select([
        'd.orderId',
        'd.donAmnt',
        'd.regAt',
        'f.fundId'
      ])
      .where('d.orderId = :orderId', { orderId })
      .getOne();
    console.log(result);
    return result;
  }

  async createOrFindDonator(userId: number, guest: CreateGuestDto){
    if (guest !== null) {
      const { userNick, userPhone, accBank, accNum } = guest;
      const user = new User();
      // TODO 주소관련 정보
      // const address = new Address();
      user.userNick = userNick;
      user.userPhone = userPhone;
      // user.accId = 1;
      return await this.userRepo.save(user);
    }
    return await this.userRepo.findOne({ where: { userId } });
  }

  async updateFundingSum(funding: Funding, donAmnt: number) {
    funding.fundSum += donAmnt;
    // TODO 펀딩 목표금액 달성 확인 후 Notification
    return await this.fundingRepo.save(funding);
  }

  async createRollingPaper(fundId:number, donation: Donation, rollMsg: string, rollImg: string){
    const rollingPaper = new RollingPaper();
    rollingPaper.donation = donation;
    rollingPaper.rollMsg = rollMsg;
    rollingPaper.fundId = fundId;
    // TODO create RolllingPaper Image
    return await this.rollingPaperRepo.save(rollingPaper);
  }

  // CREATE
  async createDonation(fundUuid: string, createDonationDto: CreateDonationDto) {
    const tmpUserId = 1;
    const donAmnt = createDonationDto.donAmnt;
    
    const user = await this.createOrFindDonator(tmpUserId, createDonationDto.guest);

    const funding = await this.fundingRepo.findOne({ where: {fundUuid}})

    const updateFunding = await this.updateFundingSum(funding, donAmnt);

    const donation = new Donation();
    donation.user = user;
    donation.funding = updateFunding;

    const orderId = require('order-id')('key').generate();
    donation.orderId = orderId;
    donation.donAmnt = donAmnt;

    const savedDonation = await this.donationRepo.save(donation);

    const rollingPaper = await this.createRollingPaper(funding.fundId, savedDonation, createDonationDto.rollMsg, createDonationDto.rollImg);
    
    return new ResponseDonationDTO(savedDonation, rollingPaper.rollId);
    // TODO 후원 등록 완료 Notification
  }

  // DELETE
  async deleteDonation(donId: number): Promise<Boolean> {
    const donation = await this.donationRepo.findOne({ where: { donId } });
    if (donation) {
      console.log(donation);
      await this.donationRepo.softDelete(donId);
      await this.rollingPaperRepo.softDelete({ rollId: donId });
      return true;
    } else {
      return false;
    }
  }
}
