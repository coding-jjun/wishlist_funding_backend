import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // private readonly accountRepository: Repository<Account>,
  ) {}

  // 사용자 정보 조회
  async getUserInfo(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ userId: id });
    return user;
  }

  // 사용자 생성
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    const now = new Date();

    user.userNick = createUserDto.userNick;
    user.userPw = createUserDto.userPw;
    user.userName = createUserDto.userName;
    user.userPhone = createUserDto.userPhone;
    user.userBirth = createUserDto.userBirth;
    user.regAt = now;
    if (createUserDto.accId) {
      user.accId = createUserDto.accId;
    }

    return await this.userRepository.save(user);
  }

  // 사용자 계좌 조회
  // async getUserAccount(userId: number) {
  //     const account = await this.accountRepository.findOneBy({ userId: userId });

  //     return account;
  // }
}
