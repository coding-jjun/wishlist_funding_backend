import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddressService } from '../address/address.service';
import { CommonResponse } from 'src/interfaces/common-response.interface';
import { FundingService } from '../funding/funding.service';
import { FundTheme } from 'src/enums/fund-theme.enum';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { DonationService } from '../donation/donation.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth-guard';
import { User } from 'src/entities/user.entity';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly addrService: AddressService,
    private readonly fundService: FundingService,
    private readonly donaService: DonationService,
    private readonly g2gExceptions: GiftogetherExceptions,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUser(
    @Req() req: Request,
  ): Promise<CommonResponse> {
    const user = req.user as { user: User } as any;
    try {
      return {
        message: '사용자 정보 조회에 성공하였습니다.',
        data: await this.userService.getUserInfo(user),
      };
    } catch (error) {
      throw this.g2gExceptions.UserNotFound;
    }
  }

  @Get('/funding')
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Req() req: Request,
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
    const user = req.user as { user: User } as any;
    try {
      const themesArray = Array.isArray(fundThemes) ? fundThemes : [fundThemes];
      const lastEndAtDate = lastEndAt ? new Date(lastEndAt) : undefined;
      const data = await this.fundService.findAll(
        user.userId,
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

  @Get('/donation')
  @UseGuards(JwtAuthGuard)
  async getUserDonation(
    @Req() req: Request,
    @Query('status', new DefaultValuePipe('ongoing')) status: 'ongoing' | 'ended',
    @Query('lastId', new DefaultValuePipe(null)) lastId?: number,
  ): Promise<CommonResponse> {
    const user = req.user as { user: User } as any;
    try {
      return {
        message: 'Success',
        data: await this.donaService.findMineAll(user.userId, status, lastId)
      }
    } catch (error) {
      throw error;
    }
  }

  @Get('/address')
  @UseGuards(JwtAuthGuard)
  async getUserAddress(
    @Req() req: Request
  ): Promise<CommonResponse> {
    const user = req.user as { user: User } as any;
    try {
      return {
        message: 'success',
        data: await this.addrService.findAll(user.userId),
      };
    } catch (error) {
      throw error;
    }
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<CommonResponse> {
    const user = req.user as { user: User } as any;
    try {
      return {
        message: '사용자 정보 갱신에 성공하였습니다.',
        data: await this.userService.updateUser(user, updateUserDto),
      };
    } catch (error) {
      throw this.g2gExceptions.UserNotUpdated;
    }
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteUser(
    @Req() req: Request
  ): Promise<CommonResponse> {
    const user = req.user as { user: User } as any;
    return {
      message: '사용자 정보 삭제에 성공하였습니다.',
      data: await this.userService.deleteUser(user),
    };
  }
}
