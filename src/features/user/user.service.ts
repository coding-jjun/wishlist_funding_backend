import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { ImageType } from 'src/enums/image-type.enum';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { DefaultImageIds } from 'src/enums/default-image-id';
import { ImageService } from '../image/image.service';
import { ImageInstanceManager } from '../image/image-instance-manager';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly g2gException: GiftogetherExceptions,

    private readonly imgService: ImageService,

    private readonly imageManager: ImageInstanceManager,
  ) {}

  // 사용자 정보 조회
  async getUserInfo(user: User): Promise<UserDto> {
    const image = await this.imageManager
      .getImages(user)
      .then((images) => images[0]);

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
      user.account?.accNum,
    );
  }

  async getOthersInfo(userId: number): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      throw this.g2gException.UserNotFound;
    }

    const image = await this.imageManager
      .getImages(user)
      .then((images) => images[0]);

    return new UserDto(
      user.userNick,
      user.userName,
      user.userPhone,
      user.userBirth,
      user.authType,
      image.imgUrl,
      user.userId,
      user.userEmail,
    );
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
        await this.imgService.delete(ImageType.User, userId);
      }
  
      // 새로운 이미지 생성 및 저장
      const savedImage = await this.imgService.save(
        userImg,
        user,
        ImageType.User,
        userId,
      );

      user.defaultImgId = null;  // 기본 이미지 ID를 null로 설정
      imageUrl = savedImage.imgUrl;  // 이미지 URL 설정
    } else if (defaultImgId) {
      // 기본 이미지가 제공된 경우
      // 기본 이미지 ID가 유효한지 확인
      if (!DefaultImageIds.User.includes(defaultImgId)) {
        throw this.g2gException.DefaultImgIdNotExist;
      }

      // 기존 사용자 지정 프로필 이미지가 있는 경우 삭제
      if (!user.defaultImgId) {
        await this.imgService.delete(ImageType.User, userId);
      }

      const defaultImage = await this.imgService.getInstanceByPK(defaultImgId);

      if (defaultImage) {
        user.defaultImgId = defaultImage.imgId; // 기본 이미지 ID 설정
        imageUrl = defaultImage.imgUrl; // 이미지 URL 설정
      } else {
        throw this.g2gException.DefaultImgIdNotExist;
      }
    } else {
      // 기본 이미지나 사용자 지정 이미지가 제공되지 않은 경우
      // 기존에 사용하던 이미지를 가져옵니다.
      const image = await this.imageManager
        .getImages(user)
        .then((images) => images[0]);

      imageUrl = image ? image.imgUrl : null;
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

    const image = await this.imageManager
      .getImages(user)
      .then((images) => images[0]);

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
