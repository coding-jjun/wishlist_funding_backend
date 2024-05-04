import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
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
import { Funding } from 'src/entities/funding.entity';
import { CommonResponse } from 'src/interfaces/common-response.interface';
import { FundTheme } from 'src/enums/fund-theme.enum';

@Controller('api/funding')
export class FundingController {
  constructor(private fundingService: FundingService) {}

  @Get('/user/:userId')
  async findAll(
    @Param('userId') userId: number,
    @Query('fundPublFilter', new DefaultValuePipe('both')) fundPublFilter: 'all' | 'friends' | 'both',
    @Query('fundThemes', new DefaultValuePipe([FundTheme.Anniversary, FundTheme.Birthday, FundTheme.Donation])) fundThemes: FundTheme | FundTheme[],
    @Query('status', new DefaultValuePipe('ongoing')) status: 'ongoing' | 'ended',
    @Query('sort', new DefaultValuePipe('endAtDesc')) sort: 'endAtAsc' | 'endAtDesc' | 'regAtAsc' | 'regAtDesc',
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('lastFundId', new DefaultValuePipe(0), ParseIntPipe) lastFundId?: number,
    @Query('lastEndAt', new DefaultValuePipe(undefined)) lastEndAt?: string,
  ): Promise<CommonResponse> {
    try {
      const themesArray = Array.isArray(fundThemes) ? fundThemes : [fundThemes];
      const lastEndAtDate = lastEndAt ? new Date(lastEndAt) : undefined;
      const data = await this.fundingService.findAll(userId, fundPublFilter, themesArray, status, sort, limit, lastFundId, lastEndAtDate);

      return { timestamp: new Date(), message: 'Success', data };
    } catch (error) {
      throw new HttpException(
        'Failed to get fundings',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post()
  async create(@Body() fundingCreateDto: CreateFundingDto): Promise<CommonResponse> {
    return {
      timestamp: new Date(Date.now()),
      message: '성공적으로 생성했습니다.',
      data: await this.fundingService.create(fundingCreateDto, ''),
    };
  }

  @Get(':fundUuid')
  async findOne(@Param('fundUuid', ParseUUIDPipe) fundUuid: string): Promise<CommonResponse> {
    return {
      timestamp: new Date(Date.now()),
      message: '성공적으로 찾았습니다.',
      data: await this.fundingService.findOne(fundUuid),
    };
  }

  @Put(':fundUuid')
  async update(
    @Param('fundUuid', ParseUUIDPipe) fundUuid: string,
    @Body() fundingUpdateDto: UpdateFundingDto,
  ): Promise<CommonResponse> {
    return {
      timestamp: new Date(Date.now()),
      message: 'success',
      data: await this.fundingService.update(fundUuid, fundingUpdateDto),
    };
  }

  @Delete(':fundUuid')
  async remove(@Param('fundUuid', ParseUUIDPipe) fundUuid: string): Promise<CommonResponse> {
    await this.fundingService.remove(fundUuid);

    return {
      timestamp: new Date(Date.now()),
      message: '성공적으로 삭제되었습니다.',
      data: null,
    };
  }
}
