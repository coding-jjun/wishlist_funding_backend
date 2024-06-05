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

  async createOnceToken(userId: number): Promise<string> {
    return this.jwtService.sign(
      { userId, time: new Date(), type: 'once' },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '20m',
      }
    );
  }

  async createAccessToken(userId: number): Promise<string> {
    return this.jwtService.sign(
      { userId, time: new Date(), type: 'access' },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '10m',
      }
    );
  }

  async createRefreshToken(userId: number): Promise<string> {
    const time = new Date();
    const token =  this.jwtService.sign(
      { userId, time: time, type: 'refresh' },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }
    );

    const refreshToken = new RefreshToken();
    refreshToken.userId = userId;
    refreshToken.refreshToken = token;

    time.setDate(time.getDate() + 7);
    refreshToken.expiresAt = time;

    await this.refreshRepository.save(refreshToken);
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

    /**
   * 
   * refresh token 유효성 검사
   */
  async validateRefreshToken(refreshToken: string, refreshInfo: any){
    const storedRefresh = await this.refreshRepository.findOne({where: {userId: refreshInfo.userId}});

    if(!storedRefresh){
      throw this.jwtException.NotValidToken;
    }

    if(refreshInfo.userId !== storedRefresh.userId){
      throw this.jwtException.NotValidToken;
    }
    
    if(refreshToken !== storedRefresh.refreshToken){
      throw this.jwtException.NotValidToken;
    }
    
    if(new Date() > storedRefresh.expiresAt){
      throw this.jwtException.RefreshExpire;
    }
    
    if(!storedRefresh.isActive){
      throw this.jwtException.NotValidToken;
    }
    return true;
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
    return user;
  }

  /**
   * 
   * 회원가입시 이전 가입이력 확인을 위해 userEmail 검증 
   */
  async validateUser(userEmail: string, authType: AuthType) {
    const user = await this.userRepository.findOne({
      where: { userEmail: userEmail },
    });

    if(user.authType !== authType){
      throw this.jwtException.UserAlreadyExists
    }

    if (!user) {
      return null;
    }
    return user;

  }

  async validUserNick(userNick: string){
    const user = await this.userRepository.findOne({
      where: {userNick: userNick}
    });
    if(user){
      return false;
    }
    return true;
  }

}
