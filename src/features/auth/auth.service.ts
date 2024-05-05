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
    console.log("token 요청 시작! : ", token);

    const userInfo =  await this.kakoApiClient.getUserInfo(token);
    // TODO id_token 설정 및 passport 설정 추가
    return userInfo;

  }
    
  }
}
