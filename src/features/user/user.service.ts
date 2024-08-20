import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { Account } from 'src/entities/account.entity';
import { Image } from 'src/entities/image.entity';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { ImageType } from 'src/enums/image-type.enum';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Account)
    private readonly accRepository: Repository<Account>,
    @InjectRepository(Image)
    private readonly imgRepository: Repository<Image>,

    private readonly g2gException: GiftogetherExceptions,
  ) {}

  // 사용자 정보 조회
  async getUserInfo(user: User): Promise<UserDto> {
    const where = user.defaultImgId
      ? { imgId: user.defaultImgId }
      : { imgType: ImageType.User, subId: user.userId };
    const image = await this.imgRepository.findOne({ where });

    return new UserDto(
      user.userNick,
      user.userName,
      user.userPhone,
      user.userBirth,
      user.authType,
      image.imgUrl,
      user.userId,
      user.userEmail,
      user.authId,
      user.account?.bank,
      user.account?.accNum
    );
  }


  async updateUser(
    user: User,
    userDto: UpdateUserDto,
  ): Promise<UserDto> {
    user.userNick = userDto.userNick;
    user.userPw = userDto.userPw;
    user.userName = userDto.userName;
    user.userPhone = userDto.userPhone;
    user.userBirth = userDto.userBirth;
    user.userEmail = userDto.userEmail;

    if (userDto.userAcc) {
      const account = await this.accRepository.findOneBy({
        accId: userDto.userAcc,
      });
      user.account = account;
    }

    let imageUrl = '';

    if (userDto.userImg) {
      user.defaultImgId = null;
      user.image = new Image(userDto.userImg, ImageType.User, user.userId);
      imageUrl = user.image.imgUrl;
    } else {
      user.defaultImgId = userDto.defaultImgId;
      imageUrl = (
        await this.imgRepository.findOne({
          where: { imgId: user.defaultImgId },
        })
      ).imgUrl;
    }
    await this.userRepository.update(user.userId, user);

    return new UserDto(
      user.userNick,
      user.userName,
      user.userPhone,
      user.userBirth,
      user.authType,
      imageUrl,
      user.userId,
      user.userEmail,
      user.authId,
      user.account?.bank,
      user.account?.accNum
    );
  }

  async deleteUser(user: User): Promise<UserDto> {
    await this.userRepository.softDelete(user.userId);

    const image = user.defaultImgId
      ? await this.imgRepository.findOne({
          where: { imgId: user.defaultImgId },
        })
      : await this.imgRepository.findOne({
          where: { imgType: ImageType.User, subId: user.userId },
        });

    return new UserDto(
      user.userNick,
      user.userName,
      user.userPhone,
      user.userBirth,
      user.authType,
      image.imgUrl,
      user.userId,
      user.userEmail,
      user.authId,
    );
  }
}
