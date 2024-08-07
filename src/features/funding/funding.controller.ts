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
} from '@nestjs/common';
import { FundingService } from './funding.service';
import { CreateFundingDto } from './dto/create-funding.dto';
import { UpdateFundingDto } from './dto/update-funding.dto';
import { GiftArray } from '../gift/dto/request-gift.dto';
import { GiftService } from '../gift/gift.service';
import { CommonResponse } from 'src/interfaces/common-response.interface';
import { FundTheme } from 'src/enums/fund-theme.enum';
import { DonationService } from '../donation/donation.service';

@Controller('funding')
export class FundingController {
  constructor(
    private fundingService: FundingService,
    private donaService: DonationService,
    private readonly giftService: GiftService,
  ) {}

  @Post()
  async create(
    @Body() createFundingDto: CreateFundingDto,
  ): Promise<CommonResponse> {
    return {
      message: '성공적으로 생성했습니다.',
      data: await this.fundingService.create(createFundingDto, ''),
    };
  }

  @Post(':fundUuid/gift')
  async createOrUpdateGift(
    @Param('fundUuid', ParseUUIDPipe) fundUuid: string,
    @Body() giftArray: GiftArray,
  ): Promise<CommonResponse> {
    const funding = await this.fundingService.findOne(fundUuid);

    try {
      return {
        message: 'Success',
        data: await this.giftService.createOrUpdateGift(
          funding.fundId,
          giftArray.gifts,
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
  async findDonation(
    @Param('fundUuid', ParseUUIDPipe) fundUuid: string,
    @Query('lastId', new DefaultValuePipe(null)) lastId?: number,
  ): Promise<CommonResponse> {
    return {
      message: '펀딩의 후원 목록을 성공적으로 조회하였습니다.',
      data: await this.donaService.findAll(fundUuid, lastId),
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
  async update(
    @Param('fundUuid', ParseUUIDPipe) fundUuid: string,
    @Body() updateFunidngDto: UpdateFundingDto,
  ): Promise<CommonResponse> {
    return {
      message: 'success',
      data: await this.fundingService.update(fundUuid, updateFunidngDto),
    };
  }

  @Delete(':fundUuid')
  async remove(
    @Param('fundUuid', ParseUUIDPipe) fundUuid: string,
  ): Promise<CommonResponse> {
    await this.fundingService.remove(fundUuid);

    return {
      message: '성공적으로 삭제되었습니다.',
      data: null,
    };
  }
}
