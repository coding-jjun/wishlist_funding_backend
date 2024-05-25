import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from 'src/entities/user.entity';
import { KakaoStrategy } from './strategy/kakao-strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategy/jwt-strategy';
import { NaverStrategy } from './strategy/naver-strategy';
import { GoogleStrategy } from './strategy/google-strategy';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),

    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [AuthService, KakaoStrategy, JwtStrategy, NaverStrategy, GoogleStrategy, GiftogetherExceptions],
  exports: [PassportModule, AuthService]
})
export class AuthModule {}
