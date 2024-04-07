import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

    user.userNick = createUserDto.userNick;
    user.userPw = createUserDto.userPw;
    user.userName = createUserDto.userName;
    user.userPhone = createUserDto.userPhone;
    user.userBirth = createUserDto.userBirth;
    if (createUserDto.accId) {
      user.accId = createUserDto.accId;
    }

    return await this.userRepository.save(user);
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where : { userId }});

    user.userNick = updateUserDto.userNick;
    user.userPw = updateUserDto.userPw;
    user.userName = updateUserDto.userName;
    user.userPhone = updateUserDto.userPhone;
    user.userBirth = updateUserDto.userBirth;
    user.userEmail = updateUserDto.userEmail;
    if (updateUserDto.accId) {
      user.accId = updateUserDto.accId;
    }
    user.userImg = updateUserDto.userImg;

    return await this.userRepository.save(user);
  }

  async deleteUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where : { userId }});
    if (!user) {
      throw HttpException
    }
    await this.userRepository.softDelete(user);

    return user;
  }

  // 사용자 계좌 조회
  // async getUserAccount(userId: number) {
  //     const account = await this.accountRepository.findOneBy({ userId: userId });

  //     return account;
  // }
}
