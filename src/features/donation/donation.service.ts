import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Donation } from 'src/entities/donation.entity';
import { RollingPaper } from 'src/entities/rolling-paper.entity';
import { CreateDonationDto } from './dto/create-donation.dto';
import { CreateGuestDto } from './dto/create-guest.dto';
import { Funding } from 'src/entities/funding.entity';
import { User } from 'src/entities/user.entity';
import { DonationDto } from './dto/donation.dto';
import { RollingPaperService } from '../rolling-paper/rolling-paper.service';
import { CreateRollingPaperDto } from '../rolling-paper/dto/create-rolling-paper.dto';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { getNow } from 'src/app.module';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Image } from 'src/entities/image.entity';
import { ImageType } from 'src/enums/image-type.enum';

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

    @InjectRepository(Image)
    private readonly imageRepo: Repository<Image>,

    private readonly rollService: RollingPaperService,

    private readonly g2gException: GiftogetherExceptions,

    // private readonly imgService : ImageService

    private eventEmitter: EventEmitter2,
  ) {}

  async getAllDonations(): Promise<Donation[]> {
    const userId = 1;
    // TODO: donation paging 처리
    const result = await this.donationRepo
      .createQueryBuilder('d')
      .leftJoinAndSelect('d.funding', 'f')
      .leftJoinAndSelect('d.user', 'u')
      .select(['d.donId', 'd.orderId', 'd.donAmnt', 'd.regAt', 'f.fundId'])
      .where('u.userId = :userId', { userId })
      .getMany();
    return result;
  }

  async getOneDonation(orderId: string) {
    const result = await this.donationRepo
      .createQueryBuilder('d')
      .leftJoinAndSelect('d.funding', 'f')
      .select(['d.orderId', 'd.donAmnt', 'd.regAt', 'f.fundId'])
      .where('d.orderId = :orderId', { orderId })
      .getOne();
    console.log(result);
    return result;
  }

  async createOrFindDonator(
    userId: number,
    guest: CreateGuestDto,
  ): Promise<User> {
    if (guest) {
      const { userNick, userPhone, accBank, accNum } = guest;
      const user = new User();
      // TODO 주소관련 정보
      // const address = new Address();
      user.userNick = userNick;
      user.userPhone = userPhone;
      // user.accId = 1;
      return this.userRepo.save(user);
    }
    return this.userRepo.findOne({ where: { userId } });
  }

  async updateFundingSum(funding: Funding, donAmnt: number) {
    funding.fundSum += donAmnt;
    // TODO 펀딩 목표금액 달성 확인 후 Notification
    await this.fundingRepo.update(
      { fundId: funding.fundId },
      { fundSum: funding.fundSum },
    );

    return funding;
  }

  // CREATE
  async createDonation(fundUuid: string, createDonationDto: CreateDonationDto) {
    const funding = await this.fundingRepo.findOne({ where: { fundUuid } });
    const now = getNow();

    if (new Date(funding.endAt).getTime() < new Date(now).getTime()) {
      throw this.g2gException.FundingClosed;
    }
     
    const tmpUserId = 1;
    const donAmnt = createDonationDto.donAmnt;

    const user = await this.createOrFindDonator(
      tmpUserId,
      createDonationDto.guest,
    );


    const updateFunding = await this.updateFundingSum(funding, donAmnt);

    const donation = new Donation();
    donation.user = user;
    donation.funding = updateFunding;

    const orderId = require('order-id')('key').generate();
    donation.orderId = orderId;
    donation.donAmnt = donAmnt;

    const savedDonation = await this.donationRepo.save(donation);

    const rollingPaper = await this.rollService.createRollingPaper(
      funding.fundId,
      savedDonation,
      new CreateRollingPaperDto(
        savedDonation.donId,
        createDonationDto.rollMsg,
        createDonationDto.rollImg,
        createDonationDto.defaultImgId,
      ),
    );

    if (updateFunding.fundSum >= updateFunding.fundGoal) {
      this.eventEmitter.emit('FundAchieve', {
        recvId: updateFunding.fundUser,  // Handling server as a sender
        subId: fundUuid
      });
    }

    // Trigger NewDonate event
    this.eventEmitter.emit('NewDonate', {
      recvId: updateFunding.fundUser,
      sendId: user.userId,
      subId: fundUuid
    });

    return new DonationDto(savedDonation, rollingPaper.rollId);
    // TODO 후원 등록 완료 Notification
  }
  
  async findAll(userId: number, status: string): Promise<DonationDto[]> {
    const currentDate = new Date();
    let query = this.donationRepo.createQueryBuilder('donation')
      .leftJoinAndSelect('donation.funding', 'funding')
      .leftJoinAndSelect('donation.user', 'user')
      .leftJoinAndSelect('funding.fundUser', 'fundUser')
      .leftJoinAndMapOne('fundUser.image', Image, 'image', 'fundUser.defaultImgId = image.imgId OR (fundUser.defaultImgId IS NULL AND image.subId = fundUser.userId AND image.imgType = :userType)', { userType: ImageType.User })
      .where('donation.userId = :userId', { userId })
      .setParameter('currentDate', currentDate);
  
    if (status === 'ongoing') {
      query.andWhere('funding.endAt >= :currentDate');
    } else if (status === 'ended') {
      query.andWhere('funding.endAt < :currentDate');
    }
  
    const donations = await query.orderBy('donation.donId', 'DESC').getMany();
    return donations.map(donation => new DonationDto(donation));
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
