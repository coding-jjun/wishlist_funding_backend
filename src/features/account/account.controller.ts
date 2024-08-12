import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { CommonResponse } from 'src/interfaces/common-response.interface';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth-guard';
import { User } from 'src/entities/user.entity';
import { Request } from 'express';

@Controller('account')
export class AccountController {
  constructor(private readonly accService: AccountService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createAccountDto: CreateAccountDto,
    @Req() req: Request,
  ): Promise<CommonResponse> {
    try {
      const user = req.user as { user: User } as any;
      const account = await this.accService.create(createAccountDto, user);
      
      return {
        message: '계좌정보를 추가하였습니다.',
        data: account,
      }
    } catch (error) {
      throw error;
    }
  }

  @Get(':accId')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('accId', ParseIntPipe) accId: number,
    @Req() req: Request,
  ): Promise<CommonResponse> {
    try {
      const user = req.user as { user: User } as any;
      const account = await this.accService.findOne(accId, user.userId);

      return {
        message: '계좌정보 조회에 성공하였습니다.',
        data: account,
      }
    } catch (error) {
      throw error;
    }
  }

  @Put(':accId')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('accId', ParseIntPipe) accId: number,
    @Body() updateAccountDto: UpdateAccountDto,
    @Req() req: Request
  ): Promise<CommonResponse> {
    try {
      const user = req.user as { user: User } as any;
      const account = await this.accService.update(accId, updateAccountDto, user.userId);

      return {
        message: '계좌정보를 수정하였습니다.',
        data: account
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete('accId')
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('accId', ParseIntPipe) accId: number,
    @Req() req: Request
  ): Promise<CommonResponse> {
    try {
      const user = req.user as { user: User } as any;
      const account = await this.accService.delete(accId, user.userId);

      return {
        message: '계좌정보를 삭제하였습니다.',
        data: account,
      }
    } catch (error) {
      throw error;
    }
  }
}
