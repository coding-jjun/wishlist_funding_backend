import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { FundingService } from './funding.service';
import { CreateFundingDto } from './dto/create-funding.dto';
import { UpdateFundingDto } from './dto/update-funding.dto';
import { Funding } from 'src/entities/funding.entity';
import { CommonResponse } from 'src/interfaces/common-response.interface';

@Controller('api/funding')
export class FundingController {
  constructor(private fundingService: FundingService) {}

  @Get()
  findAll(): Promise<Funding[]> {
    return this.fundingService.findAll();
  }

  @Post()
  create(@Body() fundingCreateDto: CreateFundingDto): CommonResponse {
    const funding = this.fundingService.create(fundingCreateDto, '');
    return {
      timestamp: new Date(Date.now()),
      message: '성공적으로 생성했습니다.',
      data: funding,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.fundingService.findOne(id);
  }

  @Put(':fundid')
  async update(
    @Param('id') id: number,
    fundingUpdateDto: UpdateFundingDto,
  ): Promise<CommonResponse> {
    return {
      timestamp: new Date(Date.now()),
      message: 'success',
      data: await this.fundingService.update(id, fundingUpdateDto),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<CommonResponse> {
    await this.fundingService.remove(id);

    return {
      timestamp: new Date(Date.now()),
      message: '성공적으로 삭제되었습니다.',
      data: null,
    };
  }
}
