import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddressService } from '../address/address.service';
import { CommonResponse } from 'src/interfaces/common-response.interface';
import { FundingService } from '../funding/funding.service';
import { FundTheme } from 'src/enums/fund-theme.enum';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { DonationService } from '../donation/donation.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly addrService: AddressService,
    private readonly fundService: FundingService,
    private readonly donaService: DonationService,
    private readonly g2gExceptions: GiftogetherExceptions,
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
      throw this.g2gExceptions.UserNotFound;
    }
  }

  @Get(':userId/funding')
  async findAll(
    @Param('userId') userId: number,
    @Query('fundPublFilter', new DefaultValuePipe('both'))
    fundPublFilter: 'all' | 'friends' | 'both' | 'mine',
    @Query(
      'fundThemes',
      new DefaultValuePipe([
        FundTheme.Anniversary,
        FundTheme.Birthday,
        FundTheme.Donation,
      ]),
    )
    fundThemes: FundTheme | FundTheme[],
    @Query('status', new DefaultValuePipe('ongoing'))
    status: 'ongoing' | 'ended',
    @Query('sort', new DefaultValuePipe('endAtDesc'))
    sort: 'endAtAsc' | 'endAtDesc' | 'regAtAsc' | 'regAtDesc',
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('lastFundUuid', new DefaultValuePipe(undefined)) lastFundUuid?: string,
    @Query('lastEndAt', new DefaultValuePipe(undefined)) lastEndAt?: string,
  ): Promise<CommonResponse> {
    try {
      const themesArray = Array.isArray(fundThemes) ? fundThemes : [fundThemes];
      const lastEndAtDate = lastEndAt ? new Date(lastEndAt) : undefined;
      const data = await this.fundService.findAll(
        userId,
        fundPublFilter,
        themesArray,
        status,
        sort,
        limit,
        lastFundUuid,
        lastEndAtDate,
      );

      return { message: 'Success', data };
    } catch (error) {
      throw new HttpException('Failed to get fundings', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/:userId/donation')
  async getUserDonation(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('status', new DefaultValuePipe('ongoing')) status: 'ongoing' | 'ended',
    @Query('lastId', new DefaultValuePipe(null)) lastId?: number,
  ): Promise<CommonResponse> {
    try {
      return {
        message: 'Success',
        data: await this.donaService.findMineAll(userId, status, lastId)
      }
    } catch (error) {
      throw error;
    }
  }

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
      throw this.g2gExceptions.UserNotUpdated;
    }
  }

  @Delete('/:userId')
  async deleteUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<CommonResponse> {
    return {
      message: '사용자 정보 삭제에 성공하였습니다.',
      data: await this.userService.deleteUser(userId),
    };
  }
}
