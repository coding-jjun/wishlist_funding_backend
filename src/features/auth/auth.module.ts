import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { KakaoApiClient } from './kakao-api-client';
import { User } from 'src/entities/user.entity';
import { KakaoStrategy } from './kakao-strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt-strategy';

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
  providers: [AuthService, KakaoApiClient, KakaoStrategy, JwtStrategy],
  exports: [PassportModule, AuthService]
})
export class AuthModule {}