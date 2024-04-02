import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Donation } from 'src/entities/donation.entity';
import { RollingPaper } from 'src/entities/rolling-paper.entity';
import { CreateDonationDto } from './dto/create-donation.dto';
import { CreateGuestDto } from './dto/create-guest.dto';

@Injectable()
export class DonationService {
  constructor(
    @InjectRepository(Donation)
    private readonly donationRepo: Repository<Donation>,

    @InjectRepository(RollingPaper)
    private readonly rollingPaperRepo: Repository<RollingPaper>,

    // @InjectRepository(Funding)
    // private readonly fundingRepo: Repository<Funding>,

    // @InjectRepository(User)
    // private readonly userRepo: Repository<User>,
  ) {}

  async getAllDonations(): Promise<Donation[]> {
    const userId = 1;
    // TODO: donation paging 처리
    const result = await this.donationRepo
      .createQueryBuilder('d')
      // .leftJoinAndSelect('d.fund', 'f')
      // .leftJoinAndSelect('d.user', 'u')
      .select([
        'd.donId',
        'd.orderId',
        'd.donAmnt',
        'd.regAt',
        // 'f.fundId'
      ])
      // .where('u.userId = :userId', { userId })
      .getMany();
    return result;
  }

  async getOneDonation(orderId: string) {
    const result = await this.donationRepo
      .createQueryBuilder('d')
      // .leftJoinAndSelect('d.fund', 'f')
      .select([
        'd.orderId',
        'd.donAmnt',
        'd.regAt',
        // 'f.fundId'
      ])
      .where('d.orderId = :orderId', { orderId })
      .getOne();
    console.log(result);
    return result;
  }

  async createOrFindDonator(userId: number, guest: CreateGuestDto) {
    //: Promise<Donation>
    if (guest !== null) {
      const { userNick, userPhone, accBank, accNum } = guest;
      // const user = new User();
      // user.userNick = userNick;
      // user.userPhone = userPhone;
      // user.accBank = accBank;
      // user.accNum = accNum;
      // await this.userRepo.save(user);
      // return user;
    }
    // return await this.userRepo.findOne({ where: { userId } });
  }

  async updateFundingSum(fundId: number, donAmnt: number) {
    //: Promise<Funding>
    // const funding = await this.fundingRepo.findOne({ where: { fundId } });
    // funding.fundSum += createDonationDto.donAmnt;
    // TODO 펀딩 목표금액 달성 확인 후 Notification
    // await this.fundingsRepo.save(funding);
    // return funding;
  }

  async createRollingPaper(rollId: number, rollMsg: string, rollImg: string) {
    const rollingPaper = new RollingPaper();
    rollingPaper.rollId = rollId;
    rollingPaper.rollMsg = rollMsg;
    // rollingPaper.rollImg = rollImg
    await this.rollingPaperRepo.save(rollingPaper);
  }

  // CREATE
  async createDonation(fundId: number, createDonationDto: CreateDonationDto) {
    // const userId = 1;
    const donAmnt = createDonationDto.donAmnt;

    // const user = await this.createOrFindDonator(userId, createDonationDto.guest);
    // const funding = await this.updateFundingSum(fundId, donAmnt);

    // CREATE donation
    const donation = new Donation();
    // donation.user = user;
    // donation.funding = funding;

    const orderId = require('order-id')('key').generate();
    donation.orderId = orderId;
    donation.donAmnt = donAmnt;

    const result = await this.donationRepo.save(donation);

    // return 값 미정
    this.createRollingPaper(result.donId, createDonationDto.rollMsg, createDonationDto.rollImg);

    console.log(result);
    return result;
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
