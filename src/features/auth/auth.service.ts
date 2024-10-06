import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthType } from 'src/enums/auth-type.enum';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { ImageType } from 'src/enums/image-type.enum';
import { RedisClientType } from '@redis/client';
import { UserDto } from '../user/dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { DefaultImageIds } from 'src/enums/default-image-id';
import { Nickname } from 'src/util/nickname';
import { GuestLoginDto } from './dto/guest-login.dto';
import { UserType } from 'src/enums/user-type.enum';
import { DonationService } from '../donation/donation.service';
import { ImageService } from '../image/image.service';

@Injectable()
export class AuthService {
  private readonly NICKNAME_ARRAY_LENGTH: number = 119;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private jwtService: JwtService,
    private readonly jwtException: GiftogetherExceptions,
    @Inject('REDIS_CLIENT')
    private readonly redisClient: RedisClientType,

    private readonly g2gException: GiftogetherExceptions,
    private readonly nickName : Nickname,

    private readonly donationService: DonationService,

    private readonly imgService: ImageService,
  ) {}

  async parseDate(yearString: string, birthday: string): Promise<Date> {
    const parts = [birthday.slice(0, 2), birthday.slice(2, 4)];
    const month = parseInt(parts[0], 10) - 1;
    const day = parseInt(parts[1], 10);
    const year = parseInt(yearString);

    return new Date(year, month, day);
  }

  async createAccessToken(userType: UserType, userId: number): Promise<string> {
    return this.jwtService.sign(
      { userId, time: new Date(), type: userType },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '30m',
      },
    );
  }
  async createRefreshToken(userId: number): Promise<string> {
    await this.redisClient.del(`user:${userId}`);
    const time = new Date();
    const token = this.jwtService.sign(
      { userId: userId, time: time },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      },
    );
    await this.redisClient.set(`user:${userId}`, token, {
      EX: 60 * 60 * 24 * 7, // 7일 동안 유효
    });
    return token;
  }

  async validateRefresh(
    userId: string,
    refreshToken: string,
  ): Promise<boolean> {
    try {
      const storedToken = await this.redisClient.get(`user:${userId}`);
      if (refreshToken !== storedToken) {
        return false;
      }
      return true;
    } catch (error) {
      throw this.jwtException.RedisServerError;
    }
  }

  async isValidPassword(plainPw: string, hashPw: string): Promise<Boolean> {
    const isValidPw = await bcrypt.compare(plainPw, hashPw);
    if (!isValidPw) {
      throw this.jwtException.PasswordIncorrect;
    }
    return true;
  }

  async login(loginDto: LoginDto): Promise<UserDto> {
    //TODO 패스워드 db 비교
    const user = await this.userRepository.findOne({
      where: { userEmail: loginDto.userEmail },
    });
    if (!user) {
      throw this.jwtException.UserNotFound;
    }

    await this.isValidPassword(loginDto.userPw, user.userPw);

    let imgUrl = null;
    if (user.defaultImgId) {
      const image = await this.imgService.getInstanceByPK(user.defaultImgId);
      imgUrl = image.imgUrl;
    } else {
      // TODO 사용자 이미지 저장 기록이 여러개 일때,
      const image = (
        await this.imgService.getInstancesBySubId(ImageType.User, user.userId)
      )[0];
      imgUrl = image.imgUrl;
    }

    return new UserDto(
      user.userNick,
      user.userName,
      user.userPhone,
      user.userBirth,
      user.authType,
      imgUrl,
      user.userId,
      user.userEmail,
      user.authId,
    );
  }

  async createUser(userDto: CreateUserDto) {
    const { userImg, userPw, defaultImgId, ...userInfo } = userDto;
    const user = new User();

    Object.assign(user, userInfo);
    const userSaved = await this.userRepository.save(user);
    const userId = user.userId;
    // Password
    if (userPw) {
      const hashPw = await bcrypt.hash(userPw, 10);
      user.userPw = hashPw;
    }

    try {
      // Image
      let imgUrl = null;
      if (userImg) {
        // 사용자 정의 이미지 제공시,
        // 1. userId를 subid로 갖는 새 image 생성 및 저장
        // 2. user의 defaultImgId 컬럼을 null로 초기화
        const imgSaved = await this.imgService.save(userImg, user, ImageType.User, userId);

        imgUrl = imgSaved.imgUrl;
        user.defaultImgId = null;
      } else {
        // 기본 이미지 제공시,
        // 1. 기본 이미지 가져오기
        // 2. user의 defaultImgId를 새 이미지의 id로 설정
        if (!defaultImgId || !DefaultImageIds.User.includes(defaultImgId))
          throw this.g2gException.DefaultImgIdNotExist;

        const defaultImage = await this.imgService.getInstanceByPK(
          userDto.defaultImgId,
        );
        user.defaultImgId = defaultImage.imgId;

        imgUrl = defaultImage.imgUrl;
      }
      await this.userRepository.update({ userId }, user);

      return new UserDto(
        userSaved.userNick,
        userSaved.userName,
        userSaved.userPhone,
        userSaved.userBirth,
        userSaved.authType,
        imgUrl,
        userSaved.userId,
        userSaved.userEmail,
        userSaved.authId,
      );
    } catch (error) {
      await this.userRepository.remove(user);
      throw error;
    }
  }

  async updateUser(user: User, userDto: UpdateUserDto): Promise<UserDto> {
    // TODO 사용자 정보를 repo에서 조회 후 updateUser 하도록 refactoring 예정
    const { userImg, ...userInfo } = userDto;
    const userId = user.userId;
    const defaultImgId = userDto.defaultImgId;

    Object.assign(user, userInfo);

    // 0. image 테이블에 등록된 사용자 프로필 이미지 삭제
    await this.imgService.delete(ImageType.User, userId);

    let imgUrl = null;
    if (userImg) {
      // 사용자 정의 이미지 제공시,
      // 1. userId를 subid로 갖는 새 image 생성 및 저장
      // 2. user의 defaultImgId 컬럼을 null로 초기화

      const imgSaved = await this.imgService.save(
        userImg,
        user,
        ImageType.User,
        userId,
      );

      imgUrl = imgSaved.imgUrl;
      user.defaultImgId = null;
    } else {
      // 기본 이미지 제공시,
      // 1. 기본 이미지 가져오기
      // 2. user의 defaultImgId를 새 이미지의 id로 설정

      if (!defaultImgId || !DefaultImageIds.User.includes(defaultImgId))
        throw this.g2gException.DefaultImgIdNotExist;

      const defaultImage = await this.imgService.getInstanceByPK(defaultImgId);
      user.defaultImgId = defaultImage.imgId;

      imgUrl = defaultImage.imgUrl;
    }
    await this.userRepository.update({ userId }, user);

    return new UserDto(
      user.userNick,
      user.userName,
      user.userPhone,
      user.userBirth,
      user.authType,
      imgUrl,
      user.userId,
      user.userEmail,
      user.authId,
    );
  }

  /**
   *
   * 회원가입시 이전 가입이력 확인을 위해 userEmail 검증
   */
  async validateUser(userEmail: string, authType: AuthType) {
    const user = await this.userRepository.findOne({
      where: { userEmail: userEmail },
    });

    if (!user) {
      return null;
    }

    if (user.authType !== authType && userEmail === user.userEmail) {
      throw this.jwtException.UserAlreadyExists;
    }

    const image = user.defaultImgId
      ? await this.imgService.getInstanceByPK(user.defaultImgId)
      : (
          await this.imgService.getInstancesBySubId(ImageType.User, user.userId)
        )[0];

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

  // DB 에서 회원 propertyName(컬럼) 중 이미 사용중인 값인지 확인 (가입전 닉네임, 전화번호...)
  async validUserInfo(propertyName: string, propertyValue: string) {
    // 동적으로 조건 생성
    const condition = {};
    condition[propertyName] = propertyValue;
    const user = await this.userRepository.findOne({
      where: condition,
    });

    if (user) {
      return false;
    }
    return true;
  }

  async verifyAccessToken(accessToken: string) {
    try {
      return await this.jwtService.verify(accessToken, {
        secret: process.env.JWT_SECRET,
      });
    } catch (error) {
      throw this.jwtException.NotValidToken;
    }
  }

  
  async logout(refreshToken: string) {
    const tokenInfo = await this.verifyRefreshToken(refreshToken);
    const userId = tokenInfo.userId;

    await this.chkValidRefreshToken(refreshToken);
    try {
    
      // refresh token blacklist 등록
      const refreshKey = `black:${userId}:${refreshToken}`;
      await this.redisClient.set(refreshKey, ' ');
      await this.redisClient.expire(refreshKey, 60 * 60 * 24 * 7); // 7일 후 blacklist 에서 삭제

      // 기존 refresh token 삭제
      await this.redisClient.del(`user:${userId}`);

    } catch (error) {
      throw this.jwtException.FailedLogout;
    }
  }


  // refresh token 유효성 검사 절차
  async chkValidRefreshToken(refreshToken: string): Promise<number> {
    if( !refreshToken){
      throw this.jwtException.TokenMissing;
    }
    const tokenInfo = await this.verifyRefreshToken(refreshToken);
    const userId = tokenInfo.userId;
    
    const isInBlackList = await this.isBlackListToken(userId, refreshToken);
    if(isInBlackList){
      throw this.jwtException.NotValidToken;
    }
    
    const isValid = await this.compareToStoredRefresh(userId, refreshToken);
    if(!isValid){
      // 중복 로그인시, 기존 로그인한 회원은 해당 에러에 걸린다.
      throw this.jwtException.NotValidToken;
    }
    return userId;
  }

  
  /**
   * refresh token 디코딩 및 유효성 검사
   */
  async verifyRefreshToken(refreshToken: string) {
    try {
      return await this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch (error) {
      throw this.jwtException.NotValidToken;
    }
  }
  
  async isBlackListToken(userId: number, token: string): Promise<boolean> {
    try {
      const result = await this.redisClient.get(`black:${userId}:${token}`);
      return result !== null;
    } catch (error) {
      console.error('Redis server error:', error);
      throw this.jwtException.RedisServerError;
    }
  }

  // redis 저장된 토큰과 비교
  async compareToStoredRefresh(
    userId: number,
    refreshToken: string,
  ): Promise<boolean> {
    try {
      const storedToken = await this.redisClient.get(`user:${userId}`);
      return refreshToken === storedToken;
    } catch (error) {
      throw this.jwtException.RedisServerError;
    }
  }

  async createRandomNickname(): Promise<string> {

    const adjectiveIndex = Math.floor(Math.random() * this.NICKNAME_ARRAY_LENGTH);
    const nounIndex = Math.floor(Math.random() * this.NICKNAME_ARRAY_LENGTH);

    const adjective = this.nickName.adjective[adjectiveIndex];
    const noun = this.nickName.noun[nounIndex];
    const baseNick = `${adjective}${noun}`;

    // userNick이 baseNick으로 시작하는 모든 사용자 조회
    const duplicateNicknames = await this.userRepository.count({
      where: { userNick: Like(`${baseNick}%`) }
    });
    if (duplicateNicknames > 0){
      return adjective+noun+(duplicateNicknames+1);
    }

    return adjective+noun;
  }


  async loginGuest(guestLoginDto: GuestLoginDto){
    const guest = await this.donationService.getGuestInfoByOrderId(guestLoginDto.orderId);
    await this.isValidPassword(guestLoginDto.userPw, guest.userPw);

    return guest;
  }
}
