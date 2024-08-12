import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { CommonResponse } from 'src/interfaces/common-response.interface';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accService: AccountService) {}

  @Post()
  async create(
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<CommonResponse> {
    const account = await this.accService.create(createAccountDto);

    return {
      message: '계좌정보를 추가하였습니다.',
      data: account,
    }
  }

  @Get(':accId')
  async findOne(
    @Param('accId', ParseIntPipe) accId: number,
  ): Promise<CommonResponse> {
    try {
      const account = await this.accService.findOne(accId);

      return {
        message: '계좌정보 조회에 성공하였습니다.',
        data: account,
      }
    } catch (error) {
      throw error;
    }
  }

  @Put(':accId')
  async update(
    @Param('accId', ParseIntPipe) accId: number,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<CommonResponse> {
    try {
      const account = await this.accService.update(accId, updateAccountDto);

      return {
        message: '계좌정보를 수정하였습니다.',
        data: account
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete('accId')
  async delete(
    @Param('accId', ParseIntPipe) accId: number
  ): Promise<CommonResponse> {
    try {
      const account = await this.accService.delete(accId);

      return {
        message: '계좌정보를 삭제하였습니다.',
        data: account,
      }
    } catch (error) {
      throw error;
    }
  }
}
