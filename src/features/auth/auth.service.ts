import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserInfo } from 'src/interfaces/user-info.interface';
import { AuthType } from 'src/enums/auth-type.enum';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { RefreshToken } from 'src/entities/refresh-token.entity';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
    private readonly jwtException: GiftogetherExceptions,

  ) {}

  async parseDate(yearString: string, birthday: string): Promise<Date> {
    const parts = [birthday.slice(0, 2), birthday.slice(2, 4)];
    const month = parseInt(parts[0], 10) - 1;
    const day = parseInt(parts[1], 10);
    const year = parseInt(yearString);

    return new Date(year, month, day);
  }

  /**
   * 새로운 Token 생성
   */
  async getNewToken(userId: number, type: string, expiresIn: string) {
    const payload = {
      userId: userId,
      time: new Date(),
      type: type,
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: expiresIn,
    });
  }


  async createOnceToken(userId: number) {
    return await this.getNewToken(userId, 'once', '20m');
  }

  async createAccessToken(userId: number) {
    return await this.getNewToken(userId, 'access', '10m');
  }

  async createRefreshToken(userId: number) {
    const token = await this.getNewToken(userId, 'refresh', '50m');

    // TODO refresh token 암호화
    return token;
  }

  /**
   * 
   * token 유효성 검사
   */
  async tokenValidate(token: string) {
    return await this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    // TODO 토큰 유효성 예외
  }

  async filterNulls(obj: any) {
    const filtered = {};
    Object.keys(obj).forEach((key) => {
      if (obj[key] !== null) {
        filtered[key] = obj[key];
      }
    });
    return filtered;
  }

  /**
   * 
   * SNS 회원가입, 회원가입 중 추가정보을 저장할 때 사용
   */
  async saveAuthUser(userInfo: any, existUser?: User, imgUrl?: string) {
    const user = existUser || new User();
    if (imgUrl) {
      // TODO 이미지 객체 생성
    }
    // TODO 중복값에 대한 예외 처리 (userPhone, userNick)
    const filteredUserInfo = await this.filterNulls(userInfo);

    if(filteredUserInfo){

      Object.assign(user, filteredUserInfo);
      return await this.userRepository.save(user);
    }
    // TODO 예외처리
    return null;
  }

  /**
   * 
   * Token 에서 추출한 userId 로 User 객체 반환
   */
  async getUser(userId: number){
    const user =  await this.userRepository.findOneBy({userId});
    if(!user){
      throw this.jwtException.UserNotFound;
    }
    return user;
  }

  /**
   * 
   * 회원가입시 이전 가입이력 확인을 위해 userEmail 검증 
   */
  async validateUser(userEmail: string) {
    const user = this.userRepository.findOne({
      where: { userEmail: userEmail },
    });
    if (!user) {
      return null;
    } else {
      return user;
    }
  }

}
