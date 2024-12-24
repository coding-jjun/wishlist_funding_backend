import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Deposit } from '../domain/entities/deposit.entity';
import { Repository } from 'typeorm';
import { FindAllDepositsCommand } from './find-all-deposits.command';

@Injectable()
export class FindAllDepositsUseCase {
  constructor(
    @InjectRepository(Deposit)
    private readonly depositRepo: Repository<Deposit>,
  ) {}

  /**
   * 관리자는 모든 이체내역을 관리할 수 있어야 합니다.
   * @param cmd query param. 필터링과 정렬에 사용됨.
   */
  async execute(cmd: FindAllDepositsCommand): Promise<Deposit[]> {
    const qb = this.depositRepo.createQueryBuilder('deposit');

    if (cmd.status) {
    }

    if (cmd.sort) {
      qb.orderBy(cmd.sort.property, cmd.sort.direction, cmd.sort.nulls);
    }

    if (cmd.lastDepositId) {
      qb.andWhere('(deposit.', {}); // TODO
    }

    if (cmd.limit) {
      qb.take(cmd.limit);
    }

    return await qb.getMany();
  }
}
