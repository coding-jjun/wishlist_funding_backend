import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddressService } from '../address/address.service';
import { CommonResponse } from 'src/interfaces/common-response.interface';
import { FundingService } from '../funding/funding.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly addrService: AddressService,
    private readonly fundService: FundingService,
  ) {}

  @Get('/:userId')
  async getUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<CommonResponse> {
    try {
      return {
        message: '사용자 정보 조회에 성공하였습니다.',
        data: await this.userService.getUserInfo(userId),
      };
    } catch (error) {
      throw new HttpException(
        'Failed to get user info',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/:userId/fundings')
  async getUserFunding(
      @Param('userId', ParseIntPipe) userId: number,
  ): Promise<CommonResponse> {
    try {
      return {
        message: '사용자의 펀딩 조회에 성공하였습니다.',
        data: await this.fundService.findMyFunds(userId),
      };
    } catch (error) {
      throw error;
    }
  }

  // @Get('/:userId/account')
  // async getUserAccount(
  //     @Param('userId', ParseIntPipe) userId: number,
  // ) {
  //     return await this.userService.getUserAccount(userId);
  // }

  @Get('/:userId/address')
  async getUserAddress(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<CommonResponse> {
    try {
      return {
        message: 'success',
        data: await this.addrService.findAll(userId),
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('/')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CommonResponse> {
    try {
      return {
        message: '사용자 생성에 성공하였습니다.',
        data: await this.userService.createUser(createUserDto),
      };
    } catch (error) {
      throw new HttpException('Failed to create user', HttpStatus.BAD_REQUEST);
    }
  }

  @Put('/:userId')
  async updateUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<CommonResponse> {
    try {
      return {
        message: '사용자 정보 갱신에 성공하였습니다.',
        data: await this.userService.updateUser(userId, updateUserDto),
      };
    } catch (error) {
      throw new HttpException('Failed to update user', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('/:userId')
  async deleteUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<CommonResponse> {
    try {
      return {
        message: '사용자 정보 삭제에 성공하였습니다.',
        data: await this.userService.deleteUser(userId),
      };
    } catch (error) {
      throw new HttpException(
        'Failed to create delete user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
