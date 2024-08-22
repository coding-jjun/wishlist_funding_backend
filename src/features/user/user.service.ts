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
    console.log(user);
    
    let imageUrl = '';

    for (const key of Object.keys(userDto)) {
      if (userDto[key] !== undefined && userDto[key] !== null) {
        // 프로필 사진을 새로 변경하는 경우
        if (key === 'userImg') {
          imageUrl = userDto[key];      
          // 기존 사용자 지정 프로필 사진이 있는 경우
          if (!user.defaultImgId) {
            // 기존 사용자 지정 프로필 사진 삭제
            await this.imgRepository.delete({
              imgType: ImageType.User,
              subId: user.userId,
            });
          }
          
          // 새로운 이미지 생성 및 저장
          const newImage = new Image(userDto.userImg, ImageType.User, user.userId);
          await this.imgRepository.save(newImage);
          
          user.defaultImgId = null;
        } else {
          if (key === 'defaultImgId') {
            if (!user.defaultImgId) {
              await this.imgRepository.delete({
                imgType: ImageType.User,
                subId: user.userId,
              });
            }
          }
          user[key] = userDto[key];
        }
      }
    }
  
    if (userDto.userPw) {
      const hashPw = await bcrypt.hash(userDto.userPw, 10);
      user.userPw = hashPw;
    }
  
    if (user.defaultImgId) {
      const image = await this.imgRepository.findOne({
        where: { imgId: user.defaultImgId },
      });
      if (image) {
        imageUrl = image.imgUrl;
      }
    } else {
      if (!userDto.userImg) {
        const image = await this.imgRepository.findOne({
          where: { 
            imgType: ImageType.User,
            subId: user.userId
          },
        });
        if (image) {
          imageUrl = image.imgUrl;
        }
      }
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
