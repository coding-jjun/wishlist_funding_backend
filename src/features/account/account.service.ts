import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/entities/account.entity';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { User } from 'src/entities/user.entity';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accRepository: Repository<Account>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly g2gException: GiftogetherExceptions,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const account = new Account();

    account.accNum = createAccountDto.accNum;
    account.bank = createAccountDto.bank;

    const user = await this.userRepository.findOne({
      where: { userId: createAccountDto.userId }
    });
    if (!user) {
      throw this.g2gException.UserNotFound;
    }

    account.user = user;

    return await this.accRepository.save(account);
  }

  async findOne(accId: number): Promise<Account> {
    const account = await this.accRepository.findOne({
      where: { accId }
    });

    if (!account) {
      throw this.g2gException.AccountNotFound;
    }

    return account;
  }

  async update(accId: number, updateAccountDto: UpdateAccountDto): Promise<Account> {
    const account = await this.accRepository.findOne({
      where: { accId }
    });

    if (!account) {
      throw this.g2gException.AccountNotFound;
    }

    account.accNum = updateAccountDto.accNum;
    account.bank = updateAccountDto.bank;

    return await this.accRepository.save(account);
  }

  async delete(accId: number): Promise<Account> {
    const account = await this.accRepository.findOne({
      where: { accId }
    });

    if (!account) {
      throw this.g2gException.AccountNotFound;
    }

    await this.accRepository.delete({ accId });

    return account;
  }
}
