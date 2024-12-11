import { Injectable } from '@nestjs/common';
import { Donation } from 'src/entities/donation.entity';
import { Funding } from 'src/entities/funding.entity';
import { CreateDonationDto } from '../../dto/create-donation.dto';
import { User } from 'src/entities/user.entity';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';

/**
 * PoC 검증을 위해 RDS에 의존하지 않는 Repository를 만들었습니다.
 */
@Injectable()
export class InMemoryDonationRepository {
  private donations: Donation[] = [];

  constructor(private readonly g2gException: GiftogetherExceptions) {}

  async create(
    funding: Funding,
    createDonationDto: CreateDonationDto,
    user: User,
  ): Promise<Donation> {
    const donation = new Donation();
    donation.donId = this.donations.length + 1;
    donation.funding = funding;

    // assign createDonationDto into donation entity
    donation.donAmnt = createDonationDto.donAmnt;
    donation.user = user;
    donation.orderId = require('order-id')('key').generate(); // Generate unique order ID

    this.donations.push(donation); // Add donation to in-memory storage

    return donation;
  }

  async getAllByUser(user: User): Promise<Donation[]> {
    return this.donations.filter((don) => don.user.userId === user.userId);
  }

  async getAllByFunding(funding: Funding): Promise<Donation[]> {
    return this.donations.filter(
      (don) => don.funding.fundId === funding.fundId,
    );
  }

  async softDelete(donation: Donation): Promise<Donation> {
    const foundDonation = this.donations.find(
      (don) => don.donId === donation.donId,
    );
    if (!donation) {
      throw this.g2gException.DonationNotExists;
    }

    foundDonation.delAt = new Date();

    return donation;
  }
}
