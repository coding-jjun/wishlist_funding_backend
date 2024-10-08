import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/entities/account.entity';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { User } from 'src/entities/user.entity';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ValidCheck } from 'src/util/valid-check';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accRepository: Repository<Account>,
    @InjectRepository(User)
    private readonly g2gException: GiftogetherExceptions,
    private readonly validCheck: ValidCheck,
  ) {}

  async create(createAccountDto: CreateAccountDto, user: User): Promise<Account> {
    const account = new Account();

    if (user.account) {
      await this.accRepository.delete(user.account);
    }

    account.accNum = createAccountDto.accNum;
    account.bank = createAccountDto.bank;
    account.user = user;

    return await this.accRepository.save(account);
  }

  async findOne(accId: number, userId: number): Promise<Account> {
    const account = await this.accRepository.findOne({
      where: { accId },
      relations: ['user']
    });
    await this.validCheck.verifyUserMatch(account.user.userId, userId);

    if (!account) {
      throw this.g2gException.AccountNotFound;
    }

    return account;
  }

  async update(accId: number, updateAccountDto: UpdateAccountDto, userId: number): Promise<Account> {
    const account = await this.accRepository.findOne({
      where: { accId },
      relations: ['user']
    });
    await this.validCheck.verifyUserMatch(account.user.userId, userId);

    if (!account) {
      throw this.g2gException.AccountNotFound;
    }

    account.accNum = updateAccountDto.accNum;
    account.bank = updateAccountDto.bank;

    return await this.accRepository.save(account);
  }

  async delete(accId: number, userId: number): Promise<Account> {
    const account = await this.accRepository.findOne({
      where: { accId },
      relations: ['user']
    });
    await this.validCheck.verifyUserMatch(account.user.userId, userId);
    
    if (!account) {
      throw this.g2gException.AccountNotFound;
    }

    await this.accRepository.delete({ accId });
    return account;
  }
}
