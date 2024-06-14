import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { Account } from 'src/entities/account.entity';
import { Image } from 'src/entities/image.entity';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { ImageType } from 'src/enums/image-type.enum';
import {
  DefaultImageId,
  defaultUserImageIds,
} from 'src/enums/default-image-id';
import { UserDto } from './dto/user.dto';
import { isMongoId } from 'class-validator';
import assert from 'assert';
import { CreateUserDto } from '../auth/dto/create-user.dto';

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

  // 사용자 생성
  async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    const dto = createUserDto;
    const user = new User();

    user.userNick = dto.userNick;
    user.userPw = dto.userPw;
    user.userName = dto.userName;
    user.userPhone = dto.userPhone;
    user.userBirth = dto.userBirth;
    user.userEmail = dto.userEmail;

    const userSaved = await this.userRepository.save(user);
    const userId = userSaved.userId;

    /// Account
    if (dto.userAcc) {
      const account = await this.accRepository.findOneBy({
        accId: dto.userAcc,
      });

      if (account) {
        userSaved.account = account;
        this.userRepository.update({ userId }, { account: account });
      }
    }

    /// Image
    let userImg: string;
    if (dto.userImg) {
      // custom image
      userImg = dto.userImg;
      const image = new Image(dto.userImg!, ImageType.User, userSaved.userId);

      this.imgRepository.save(image);
    } else {
      // default image
      assert(
        dto.defaultImgId && defaultUserImageIds.includes(dto.defaultImgId),
      );

      const defaultImage = await this.imgRepository.findOne({
        where: {
          imgId: dto.defaultImgId!,
        },
      });
      userImg = defaultImage.imgUrl;

      userSaved.defaultImgId = dto.defaultImgId!;
      this.userRepository.update(
        { userId },
        { defaultImgId: userSaved.defaultImgId },
      );
    }

    return new UserDto(
      userSaved.userNick,
      userSaved.userName,
      userSaved.userPhone,
      userSaved.userBirth,
      userSaved.authType,
      userImg,
      userSaved.userId,
      userSaved.userEmail,
      userSaved.authId,
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

    let imageUrl = '';

    if (updateUserDto.userImg) {
      user.defaultImgId = null;
      user.image = new Image(updateUserDto.userImg, ImageType.User, userId);
      imageUrl = user.image.imgUrl;
    } else {
      user.defaultImgId = updateUserDto.defaultImgId!;
      imageUrl = (
        await this.imgRepository.findOne({
          where: { imgId: user.defaultImgId },
        })
      ).imgUrl;
    }
    await this.userRepository.update(userId, user);

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
