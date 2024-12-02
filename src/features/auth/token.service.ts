import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { RedisClientType } from "@redis/client/dist/lib/client";
import { UserRole } from "src/enums/user-role.enum";
import { GiftogetherExceptions } from "src/filters/giftogether-exception";
import { TokenDto } from "./dto/token.dto";

@Injectable()
export class TokenService {
  private readonly jwtService: JwtService

  @Inject('REDIS_CLIENT')
  private readonly redisClient: RedisClientType

  private readonly g2gException: GiftogetherExceptions

  async createAccessToken(userType: UserType, userId: number, isAdmin: boolean): Promise<string> {
  async issueUserRoleBasedToken(userId:number, isAdmin:boolean): Promise<TokenDto> {

    const role = isAdmin ? UserRole.ADMIN : UserRole.USER;

    const accessToken = await this.createAccessToken(role, userId);
    const refreshToken = await this.createRefreshToken(userId);

    return new TokenDto(accessToken, refreshToken);

  }
    return this.jwtService.sign(
      { userId,
        time: new Date(),
        type: userType,
        isAdmin: isAdmin
      },
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

  async verifyAccessToken(accessToken: string) {
    try {
      return await this.jwtService.verify(accessToken, {
        secret: process.env.JWT_SECRET,
      });
    } catch (error) {
      throw this.g2gException.NotValidToken;
    }
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
        throw this.g2gException.NotValidToken;
      }
    }

  async isBlackListToken(userId: number, token: string): Promise<boolean> {
    try {
      const result = await this.redisClient.get(`black:${userId}:${token}`);
      return result !== null;
    } catch (error) {
      console.error('Redis server error:', error);
      throw this.g2gException.RedisServerError;
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
      throw this.g2gException.RedisServerError;
    }
  }

  

  // refresh token 유효성 검사 절차
  async chkValidRefreshToken(refreshToken: string): Promise<number> {
    if( !refreshToken){
      throw this.g2gException.TokenMissing;
    }
    const tokenInfo = await this.verifyRefreshToken(refreshToken);
    const userId = tokenInfo.userId;
    
    const isInBlackList = await this.isBlackListToken(userId, refreshToken);
    if(isInBlackList){
      throw this.g2gException.NotValidToken;
    }
    
    const isValid = await this.compareToStoredRefresh(userId, refreshToken);
    if(!isValid){
      // 중복 로그인시, 기존 로그인한 회원은 해당 에러에 걸린다.
      throw this.g2gException.NotValidToken;
    }
    return userId;
  }

  async setRefreshTokenToBlackList(userId: number, refreshToken: String) {
    try {
    
      // refresh token blacklist 등록
      const refreshKey = `black:${userId}:${refreshToken}`;
      await this.redisClient.set(refreshKey, ' ');
      await this.redisClient.expire(refreshKey, 60 * 60 * 24 * 7); // 7일 후 blacklist 에서 삭제

      // 기존 refresh token 삭제
      await this.redisClient.del(`user:${userId}`);

    } catch (error) {
      throw this.g2gException.FailedLogout;
    }
  }


}