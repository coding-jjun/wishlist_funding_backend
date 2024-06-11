import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { Account } from 'src/entities/account.entity';
import { Image } from 'src/entities/image.entity';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { ImageType } from 'src/enums/image-type.enum';
import { DefaultImageId } from 'src/enums/default-image-id';
import { UserDto } from './dto/user.dto';
import { isMongoId } from 'class-validator';

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
  async getUserInfo(id: number): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: { userId: id },
    });
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
    );
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
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

    const image = updateUserDto
      ? new Image(updateUserDto.userImg, ImageType.User, userId)
      : await this.imgRepository.findOne({
          where: { imgId: DefaultImageId.User },
        });

    if (updateUserDto.userImg) {
      user.defaultImgId = null;
    } else {
      user.defaultImgId = image.imgId;
    }
    await this.userRepository.update(userId, user);
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

  async deleteUser(userId: number): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      throw this.g2gException.UserAlreadyDeleted;
    }
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

  // 사용자 계좌 조회
  // async getUserAccount(userId: number) {
  //     const account = await this.accountRepository.findOneBy({ userId: userId });

  //     return account;
  // }
}
