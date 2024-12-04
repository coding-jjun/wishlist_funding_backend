import { Injectable } from '@nestjs/common';
import { Deposit } from '../../domain/entities/deposit.entity';
import { InMemoryDepositRepository } from '../../infrastructure/repositories/in-memory-deposit.repository';
import { DepositDto } from '../../dto/deposit.dto';

@Injectable()
export class UploadDepositUseCase {
  constructor(private readonly depositRepository: InMemoryDepositRepository) {}

  execute(depositData: DepositDto): Deposit {
    const deposit = Deposit.create({
      sender: depositData.sender,
      receiver: depositData.receiver,
      amount: depositData.amount,
      transferDate: depositData.transferDate,
      depositBank: depositData.depositBank,
      depositAccount: depositData.depositAccount,
      withdrawalAccount: depositData.withdrawalAccount,
    });

    this.depositRepository.save(deposit);

    return deposit;
  }
}
