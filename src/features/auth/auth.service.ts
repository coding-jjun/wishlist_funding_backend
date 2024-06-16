import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthType } from 'src/enums/auth-type.enum';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { Image } from 'src/entities/image.entity';
import { ImageType } from 'src/enums/image-type.enum';
import { RedisClientType } from '@redis/client';
import { DefaultImageId, defaultUserImageIds } from 'src/enums/default-image-id';
import { UserDto } from '../user/dto/user.dto';
import { Account } from 'src/entities/account.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Image)
    private readonly imgRepository: Repository<Image>,
    @InjectRepository(Account)
    private readonly accRepository: Repository<Account>,

    private jwtService: JwtService,
    private readonly jwtException: GiftogetherExceptions,
    @Inject('REDIS_CLIENT')
    private readonly redisClient: RedisClientType,

    private readonly g2gException: GiftogetherExceptions,
  ) {}

  async parseDate(yearString: string, birthday: string): Promise<Date> {
    const parts = [birthday.slice(0, 2), birthday.slice(2, 4)];
    const month = parseInt(parts[0], 10) - 1;
    const day = parseInt(parts[1], 10);
    const year = parseInt(yearString);

    return new Date(year, month, day);
  }

  async createAccessToken(userId: number): Promise<string> {
    return this.jwtService.sign(
      { userId, time: new Date()},
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '30m',
      }
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
      }
    );
    await this.redisClient.set(`user:${userId}`, token, {
      EX: 60 * 60 * 24 * 7, // 7일 동안 유효
    });  
    return token;
  }

  /**
   * refresh token 디코딩 및 유효성 검사
   */
  async verifyRefreshToken(refreshToken: string){
    try{
      return await this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    }catch(error){
      throw this.jwtException.NotValidToken;
    }

  }


  async validateRefresh(userId: string, refreshToken: string): Promise<boolean> {
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

  async login(loginDto: LoginDto): Promise<UserDto>{
    //TODO 패스워드 db 비교
    const user = await this.userRepository.findOne({
      where: {userEmail: loginDto.userEmail,
              userPw : loginDto.userPw}
    });
    if(!user){
      this.jwtException.UserNotFound;
    }
    let imgUrl = null;
    if(user.defaultImgId){
      const image = await this.imgRepository.findOne({
        where: {imgId: user.defaultImgId}
      })
      imgUrl = image.imgUrl;

      }else{
      
        // TODO 사용자 이미지 저장 기록이 여러개 일때,
        const image = await this.imgRepository.findOne({
          where: {subId: user.userId,
                  imgType: ImageType.User}
        })
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
      user.authId
    )
  }
  



  async createUser(userDto: CreateUserDto) {
    const {userImg, userAcc, defaultImgId, ...userInfo} = userDto;
    const user = new User();

    // TODO 중복값에 대한 예외 처리 (userPhone, userNick)
    Object.assign(user, userInfo);
    const userSaved = await this.userRepository.save(user);
    const userId = user.userId;
    
    try {
      // Account
      if (userAcc) {
        const account = await this.accRepository.findOneBy({
          accId: userAcc,
        });
        if (account) {
          userSaved.account = account;
        }
      }
      // Image
      let imgUrl = null;
      if (userImg) {
        // 사용자 정의 이미지 제공시,
        // 1. userId를 subid로 갖는 새 image 생성 및 저장
        // 2. user의 defaultImgId 컬럼을 null로 초기화
        const image = new Image(userImg, ImageType.User, userId);
        const imgSaved = await this.imgRepository.save(image);

        imgUrl = imgSaved.imgUrl;
        user.defaultImgId = null;
      } else {
        // 기본 이미지 제공시,
        // 1. 기본 이미지 가져오기
        // 2. user의 defaultImgId를 새 이미지의 id로 설정
        if (!defaultImgId || !defaultUserImageIds.includes(defaultImgId))
          throw this.g2gException.DefaultImgIdNotExist;

        const defaultImage = await this.imgRepository.findOne({
          where: { imgId: userDto.defaultImgId },
        });
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
      this.userRepository.remove(user);
      throw error;
    }

  }
  

  async updateUser(user:User, userDto: UpdateUserDto): Promise<UserDto>{
    const { userImg,userAcc, ...userInfo } = userDto;
    const userId = user.userId;
    const defaultImgId = userDto.defaultImgId;

    Object.assign(user, userInfo);

    if (userAcc) {
      const account = await this.accRepository.findOneBy({
        accId: userAcc,
      });
      user.account = account;
    }

    // 0. image 테이블에 등록된 사용자 프로필 이미지 삭제
    this.imgRepository.delete({ imgType: ImageType.User, imgId: userId });

    let imgUrl = null;
    if (userImg) {
      // 사용자 정의 이미지 제공시,
      // 1. userId를 subid로 갖는 새 image 생성 및 저장
      // 2. user의 defaultImgId 컬럼을 null로 초기화

      const image = new Image(userImg, ImageType.User, userId);
      const imgSaved = await this.imgRepository.save(image);

      imgUrl = imgSaved.imgUrl;
      user.defaultImgId = null;
    } else {
      // 기본 이미지 제공시,
      // 1. 기본 이미지 가져오기
      // 2. user의 defaultImgId를 새 이미지의 id로 설정

      if (!defaultImgId || !defaultUserImageIds.includes(defaultImgId))
        throw this.g2gException.DefaultImgIdNotExist;

      const defaultImage = await this.imgRepository.findOne({
        where: { imgId: defaultImgId },
      });
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
    )
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

    if(user.authType !== authType && userEmail === user.userEmail){
      throw this.jwtException.UserAlreadyExists
    }

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


  // DB 에서 회원 propertyName(컬럼) 중 이미 사용중인 값인지 확인 (가입전 닉네임, 전화번호...)
  async validUserInfo(propertyName: string, propertyValue: string){
    // 동적으로 조건 생성
    const condition = {};
    condition[propertyName] = propertyValue;  
    const user = await this.userRepository.findOne({
      where: condition
    });
  
    if (user) {
      return false;
    }
    return true;
  }

  async verifyAccessToken(accessToken: string){
    try{
      return await this.jwtService.verify(accessToken, {
        secret: process.env.JWT_SECRET,
      });
    }catch(error){
      throw this.jwtException.NotValidToken;
    }

  }

  async isBlackListToken(userId: string, token: string): Promise<boolean> {
    try {
      const result = await this.redisClient.get(`black:${userId}:${token}`);
      return result !== null;
    } catch (error) {
      console.error('Redis server error:', error);
      throw this.jwtException.RedisServerError;
    }
  }
  async logout(userId: string, accessToken: string, refreshToken: string) {
    try {

      const accessKey = `black:${userId}:${accessToken}`;
      await this.redisClient.set(accessKey, ' ');
      await this.redisClient.expire(accessKey, 60 * 30);
  
      const refreshKey = `black:${userId}:${refreshToken}`;
      await this.redisClient.set(refreshKey, ' ');
      await this.redisClient.expire(refreshKey, 60 * 60 * 24 * 7);
  
      await this.redisClient.del(`user:${userId}`);

    } catch (error) {
      throw this.jwtException.FailedLogout;
    }
  }
  

}
