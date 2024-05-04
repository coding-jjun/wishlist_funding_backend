import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { CommonResponse } from 'src/interfaces/common-response.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:userId')
  async getUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<CommonResponse> {
    try {
      return {
        timestamp: new Date(),
        message: 'success',
        data : await this.userService.getUserInfo(userId),
      };
    } catch (error) {
      throw new HttpException(
        'Failed to get user info',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // @Get('/:userId/fundings')
  // async getUserFunding(
  //     @Param('userId', ParseIntPipe) id: number,
  // ): Promise<Funding[]> {
  //     return await this.fundingService.getUserFundings(userId);
  // }

  // @Get('/:userId/account')
  // async getUserAccount(
  //     @Param('userId', ParseIntPipe) userId: number,
  // ) {
  //     return await this.userService.getUserAccount(userId);
  // }

  @Post('/')
  async createUser(
    @Body() createUserDto : CreateUserDto,
  ): Promise<CommonResponse> {
    try {
      return {
        timestamp: new Date(Date.now()),
        message: 'success',
        data: await this.userService.createUser(createUserDto),
      };
    } catch (error) {
      throw new HttpException(
        'Failed to create user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('/:userId')
  async updateUser(
    @Param('userId', ParseIntPipe) userId : number,
    @Body() updateUserDto : UpdateUserDto,
  ): Promise<CommonResponse> {
    try {
      return {
        timestamp: new Date(Date.now()),
        message: 'success',
        data: await this.userService.updateUser(userId, updateUserDto),
      };
    } catch (error) {
      throw new HttpException(
        'Failed to update user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('/:userId')
  async deleteUser(
    @Param('userId', ParseIntPipe) userId : number,
  ): Promise<CommonResponse> {
    try {
      return {
        timestamp: new Date(Date.now()),
        message: 'success',
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
