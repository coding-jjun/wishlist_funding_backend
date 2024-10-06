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
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { FundingService } from './funding.service';
import { CreateFundingDto } from './dto/create-funding.dto';
import { UpdateFundingDto } from './dto/update-funding.dto';
import { GiftArray } from '../gift/dto/request-gift.dto';
import { GiftService } from '../gift/gift.service';
import { CommonResponse } from 'src/interfaces/common-response.interface';
import { FundTheme } from 'src/enums/fund-theme.enum';
import { DonationService } from '../donation/donation.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth-guard';
import { User } from 'src/entities/user.entity';

@Controller('funding')
export class FundingController {
  constructor(
    private fundingService: FundingService,
    private donaService: DonationService,
    private readonly giftService: GiftService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createFundingDto: CreateFundingDto,
    @Req() req: Request
  ): Promise<CommonResponse> {
    const user = req.user as { user: User } as any;
    return {
      message: '성공적으로 생성했습니다.',
      data: await this.fundingService.create(createFundingDto, user),
    };
  }

  @Post(':fundUuid/gift')
  @UseGuards(JwtAuthGuard)
  async createOrUpdateGift(
    @Param('fundUuid', ParseUUIDPipe) fundUuid: string,
    @Body() giftArray: GiftArray,
    @Req() req: Request
  ): Promise<CommonResponse> {
    const user = req.user as { user: User } as any;
    try {
      const funding = await this.fundingService.findFundingByUuidAndUserId(fundUuid, user.userId);
      return {
        message: 'Success',
        data: await this.giftService.createOrUpdateGift(
          funding,
          giftArray.gifts,
          user,
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(
    @Query('fundThemes', new DefaultValuePipe([
      FundTheme.Anniversary,
      FundTheme.Birthday,
      FundTheme.Donation,
    ])) fundThemes: FundTheme | FundTheme[],
    @Query('status', new DefaultValuePipe('ongoing')) status: 'ongoing' | 'ended',
    @Query('sort', new DefaultValuePipe('endAtDesc')) sort: 'endAtAsc' | 'endAtDesc' | 'regAtAsc' | 'regAtDesc',
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('lastFundUuid', new DefaultValuePipe(undefined)) lastFundUuid?: string,
    @Query('lastEndAt', new DefaultValuePipe(undefined)) lastEndAt?: string,
  ): Promise<CommonResponse> {
    try {
      const themesArray = Array.isArray(fundThemes) ? fundThemes : [fundThemes];
      const lastEndAtDate = lastEndAt ? new Date(lastEndAt) : undefined;
      const data = await this.fundingService.findAll(
        0,
        'all',
        themesArray,
        status,
        sort,
        limit,
        lastFundUuid,
        lastEndAtDate,
      )

      return {
        message: 'Success',
        data
      };
    } catch (error) {
      throw new HttpException('Failed to get fundings', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':fundUuid/donation')
  @UseGuards(JwtAuthGuard)
  async findDonation(
    @Req() req: Request,
    @Param('fundUuid', ParseUUIDPipe) fundUuid: string,
    @Query('lastId', new DefaultValuePipe(null)) lastId?: number,
  ): Promise<CommonResponse> {
    const user = req.user as { user: User } as any;
    const funding = await this.fundingService.findFundingByUuidAndUserId(fundUuid, user.userId);
    return {
      message: '펀딩의 후원 목록을 성공적으로 조회하였습니다.',
      data: await this.donaService.findAll(funding, lastId),
    };
  }

  @Get(':fundUuid')
  async findOne(
    @Param('fundUuid', ParseUUIDPipe) fundUuid: string,
  ): Promise<CommonResponse> {
    return {
      message: '성공적으로 찾았습니다.',
      data: await this.fundingService.findOne(fundUuid),
    };
  }

  @Put(':fundUuid')
  @UseGuards(JwtAuthGuard)
  async update(
    @Req() req: Request,
    @Param('fundUuid', ParseUUIDPipe) fundUuid: string,
    @Body() updateFunidngDto: UpdateFundingDto,
  ): Promise<CommonResponse> {
    const user = req.user as { user: User } as any;
    return {
      message: 'success',
      data: await this.fundingService.update(fundUuid, updateFunidngDto, user),
    };
  }

  @Delete(':fundUuid')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Req() req: Request,
    @Param('fundUuid', ParseUUIDPipe) fundUuid: string,
  ): Promise<CommonResponse> {
    const user = req.user as { user: User } as any;
    await this.fundingService.remove(fundUuid, user.userId);
    return {
      message: '성공적으로 삭제되었습니다.',
      data: null,
    };
  }
}
