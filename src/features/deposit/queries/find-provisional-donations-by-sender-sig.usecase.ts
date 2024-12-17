import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProvisionalDonation } from '../domain/entities/provisional-donation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindProvDonationsBySenderSigUseCase {
  constructor(
    @InjectRepository(ProvisionalDonation)
    private readonly provDonRepo: Repository<ProvisionalDonation>,
  ) {}

  async execute(senderSig: string): Promise<ProvisionalDonation[]> {
    const provDonations = this.provDonRepo.find({ where: { senderSig } });

    return provDonations;
  }
}
