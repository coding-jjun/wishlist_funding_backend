import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ){}
    async parseDate(yearString: string, birthday: string):Promise<Date> {
  
  async parseDate(yearString: string, birthday: string):Promise<Date> {
    const parts = [birthday.slice(0, 2), birthday.slice(2, 4)];
    const month = parseInt(parts[0], 10) - 1;
    const day = parseInt(parts[1], 10);
    const year = parseInt(yearString);

    return new Date(year, month, day);
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
