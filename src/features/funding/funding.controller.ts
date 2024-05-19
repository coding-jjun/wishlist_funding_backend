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
import { FundTheme } from 'src/enums/fund-theme.enum';
import { GiftArray } from '../gift/dto/request-gift.dto';
import { GiftService } from '../gift/gift.service';
import { CommonResponse } from 'src/interfaces/common-response.interface';

@Controller('funding')
export class FundingController {
  constructor(
    private fundingService: FundingService,
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
