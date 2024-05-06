import { Injectable } from '@nestjs/common';
import { KakaoApiClient } from './kakao-api-client';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private kakoApiClient: KakaoApiClient,
  ){}


  async requestKakaoToken(code: string){
    const response = await this.kakoApiClient.requestKakaoToken(code);
    const token = response.access_token

    const userInfo =  await this.kakoApiClient.getUserInfo(token);
    const user = await this.userRepository.findOne({where: {kakaoId: userInfo.id}})

    if(!user){
      const user = new User();
      // image = userInfo.profile.profile_image_url;
      const year = userInfo.kakao_account.year;
      const birthday = userInfo.kakao_account.birthday;
      user.kakaoId = userInfo.id; 
      user.userNick = userInfo.kakao_account.profile.nickname;
      user.userName = userInfo.kakao_account.name;
      user.userPhone = userInfo.kakao_account.phone_number;
      user.userBirth = await this.parseDate(year, birthday);
      user.userEmail = userInfo.kakao_account.email;
      const saveduser =  await this.userRepository.save(user);
      console.log(saveduser);
      return saveduser;
    }else{
      console.log(user);
      return user;
    }
  }
    async parseDate(yearString: string, birthday: string):Promise<Date> {
    const parts = [birthday.slice(0, 2), birthday.slice(2, 4)];
    const month = parseInt(parts[0], 10) - 1;
    const day = parseInt(parts[1], 10);
    const year = parseInt(yearString);

    return new Date(year, month, day);
  }


    // TODO id_token 설정 및 passport 설정 추가 
  }
