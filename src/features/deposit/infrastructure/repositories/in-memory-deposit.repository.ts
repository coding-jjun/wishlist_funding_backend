import { Injectable } from '@nestjs/common';
import { Deposit } from '../../domain/entities/deposit.entity';

/**
 * PoC 검증을 위해 RDS에 의존하지 않는 Repository를 만들었습니다.
 */
@Injectable()
export class InMemoryDepositRepository {
  private deposits: Deposit[] = [];

  save(deposit: Deposit): void {
    this.deposits.push(deposit);
  }

  findAll(): Deposit[] {
    return this.deposits;
  }
}
