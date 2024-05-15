import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService
  ){}
  
  async parseDate(yearString: string, birthday: string):Promise<Date> {
    const parts = [birthday.slice(0, 2), birthday.slice(2, 4)];
    const month = parseInt(parts[0], 10) - 1;
    const day = parseInt(parts[1], 10);
    const year = parseInt(yearString);

    return new Date(year, month, day);
  }

  async getNewToken(userEmail: string, type: string, expiresIn: string){
    const payload = {
      userEmail: userEmail,
      time: new Date(),
      type: type,
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: expiresIn,
    });
  }

  async onceToken(userEmail: string) {
    return await this.getNewToken(userEmail, 'once', '20m');
  }

  async createAccessToken(userEmail: string) {
    return await this.getNewToken(userEmail, 'access', '10m');
  }
  
  async createRefreshToken(userEmail: string) { 

    const token = await this.getNewToken(userEmail, 'refresh', '50m');

    // TODO refresh token 암호화
    return token;
  }

  async tokenValidate(token: string) {
    return await this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
  }

  async filterNulls(obj: any) {
    const filtered = {};
    Object.keys(obj).forEach(key => {
      if (obj[key] !== null) {
        filtered[key] = obj[key];
      }
    });
    return filtered;
  }


  async saveAuthUser(userInfo: any, existUser?: User, imgUrl?: string){
    const user = existUser || new User();
    if (imgUrl) {
      // TODO 이미지 객체 생성
    }
    const filteredUserInfo = await this.filterNulls(userInfo);
    Object.assign(user, filteredUserInfo);

    return await this.userRepository.save(user);

  }

  async validateUser(userEmail: string) {
    const user = this.userRepository.findOne({where: { userEmail: userEmail }});
    if (!user){
      return null;
    }else{
      return user;
    }
  }
}
