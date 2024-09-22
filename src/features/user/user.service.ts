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
import { DefaultImageIds } from 'src/enums/default-image-id';

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

  async getOthersInfo(userId: number): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { userId } });

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
      user.userEmail
    )
  }

  async updateUser(
    user: User,
    userDto: UpdateUserDto,
  ): Promise<UserDto> {
    const userId = user.userId;
    const { userImg, defaultImgId, ...userInfo } = userDto;
  
    // 1. userInfo를 user 객체에 병합
    Object.assign(user, userInfo);
  
    let imageUrl = '';
  
    // 2. 이미지 처리
    if (userImg) { // 사용자 지정 이미지가 제공된 경우
      // 기존 사용자 지정 프로필 이미지가 있는 경우 삭제
      if (!user.defaultImgId) {
        await this.imgRepository.delete({
          imgType: ImageType.User,
          subId: userId,
        });
      }
  
      // 새로운 이미지 생성 및 저장
      const newImage = new Image(userImg, ImageType.User, userId);
      const savedImage = await this.imgRepository.save(newImage);

      user.defaultImgId = null;  // 기본 이미지 ID를 null로 설정
      imageUrl = savedImage.imgUrl;  // 이미지 URL 설정
    } else if (defaultImgId) { // 기본 이미지가 제공된 경우
      // 기본 이미지 ID가 유효한지 확인
      if (!DefaultImageIds.User.includes(defaultImgId)) {
        throw this.g2gException.DefaultImgIdNotExist;
      }
  
      // 기존 사용자 지정 프로필 이미지가 있는 경우 삭제
      if (!user.defaultImgId) {
        await this.imgRepository.delete({
          imgType: ImageType.User,
          subId: userId,
        });
      }
  
      const defaultImage = await this.imgRepository.findOne({
        where: { imgId: defaultImgId },
      });
  
      if (defaultImage) {
        user.defaultImgId = defaultImage.imgId;  // 기본 이미지 ID 설정
        imageUrl = defaultImage.imgUrl;  // 이미지 URL 설정
      } else {
        throw this.g2gException.DefaultImgIdNotExist;
      }
    } else { // 기본 이미지나 사용자 지정 이미지가 제공되지 않은 경우
      if (user.defaultImgId) {
        const image = await this.imgRepository.findOne({
          where: { imgId: user.defaultImgId },
        });
        if (image) {
          imageUrl = image.imgUrl;  // 기존 기본 이미지의 URL 설정
        }
      } else {
        const image = await this.imgRepository.findOne({
          where: { 
            imgType: ImageType.User,
            subId: userId,
          },
        });
        if (image) {
          imageUrl = image.imgUrl;  // 기존 사용자 지정 이미지의 URL 설정
        }
      }
    }
  
    // 3. 비밀번호 해시 처리
    if (userDto.userPw) {
      const hashPw = await bcrypt.hash(userDto.userPw, 10);
      user.userPw = hashPw;
    }
  
    // 4. 사용자 정보 업데이트
    await this.userRepository.update(userId, user);
  
    // 5. 업데이트된 사용자 정보를 반환
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
