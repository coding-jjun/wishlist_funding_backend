import { Injectable } from '@nestjs/common';
import { Deposit } from '../domain/entities/deposit.entity';
import { InMemoryDepositRepository } from '../infrastructure/repositories/in-memory-deposit.repository';
import { DepositDto } from '../dto/deposit.dto';

@Injectable()
export class UploadDepositUseCase {
  constructor(private readonly depositRepository: InMemoryDepositRepository) {}

  execute(depositData: DepositDto): Deposit {
    const deposit = Deposit.create(
      depositData.senderSig,
      depositData.receiver,
      depositData.amount,
      depositData.transferDate,
      depositData.depositBank,
      depositData.depositAccount,
      depositData.withdrawalAccount,
    );

    this.depositRepository.save(deposit);

    return deposit;
  }
}
