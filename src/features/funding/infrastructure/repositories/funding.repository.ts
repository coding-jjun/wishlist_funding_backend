import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Funding } from 'src/entities/funding.entity';
import { Repository } from 'typeorm';

/**
 * 이미 TypeORM Repository가 있는데 굳이 레이어를 하나 더 두는 이유는
 * 다른 객체로의 치환이 용이하게끔 하기 위해서입니다. 도메인 로직이 쿼리 빌더에
 * 신경을 쓰지 않도록 함으로써 self-descriptive한 코드를 작성할 수 있게
 * 될 것입니다.
 */
@Injectable()
export class FundingRepository {
  constructor(
    @InjectRepository(Funding) private readonly repository: Repository<Funding>,
  ) {}

  async increasefundSum(funding: Funding, amount: number) {
    this.repository
      .createQueryBuilder()
      .update(funding)
      .set({ fundSum: () => 'fundSum + :amount' })
      .setParameter('amount', amount)
      .where('fundId: :fundId', { fundId: funding.fundId })
      .execute();
  }
}
