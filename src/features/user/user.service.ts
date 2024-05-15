import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Account } from 'src/entities/account.entity';
import { Image } from 'src/entities/image.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Account)
    private readonly accRepository: Repository<Account>,
    @InjectRepository(Image)
    private readonly imgRepository: Repository<Image>,
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
    user.userEmail = createUserDto.userEmail;
    if (createUserDto.userAcc) {
      const account = await this.accRepository.findOneBy({
        accId: createUserDto.userAcc,
      });
      user.account = account;
    }
    if (createUserDto.userImg) {
      const image = await this.imgRepository.findOneBy({
        imgId: createUserDto.userImg,
      });
      user.image = image;
    }

    return await this.userRepository.save(user);
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { userId } });

    user.userNick = updateUserDto.userNick;
    user.userPw = updateUserDto.userPw;
    user.userName = updateUserDto.userName;
    user.userPhone = updateUserDto.userPhone;
    user.userBirth = updateUserDto.userBirth;
    user.userEmail = updateUserDto.userEmail;
    if (updateUserDto.userAcc) {
      const account = await this.accRepository.findOneBy({
        accId: updateUserDto.userAcc,
      });
      user.account = account;
    }
    if (updateUserDto.userImg) {
      const image = await this.imgRepository.findOneBy({
        imgId: updateUserDto.userImg,
      });
      user.image = image;
    }
    return await this.userRepository.save(user);
  }

  async deleteUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      throw HttpException;
    }
    await this.userRepository.softDelete(user.userId);

    return user;
  }

  // 사용자 계좌 조회
  // async getUserAccount(userId: number) {
  //     const account = await this.accountRepository.findOneBy({ userId: userId });

  //     return account;
  // }
}
