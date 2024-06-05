import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Account } from 'src/entities/account.entity';
import { Image } from 'src/entities/image.entity';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { ImageType } from 'src/enums/image-type.enum';
import { DefaultImageId } from 'src/enums/default-image-id';
import { UserDto } from './dto/user.dto';

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
  async getUserInfo(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ userId: id });
    return user;
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
      const defaultImage = await this.imgRepository.findOne({
        where: {
          imgId: DefaultImageId.User,
        },
      });
      userImg = defaultImage.imgUrl;

      userSaved.defaultImgId = DefaultImageId.User;
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
