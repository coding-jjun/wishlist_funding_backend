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
import { FundingCreateDto } from './dto/funding-create.dto';
import { FundingUpdateDto } from './dto/funding-update.dto';
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
  create(@Body() fundingCreateDto: FundingCreateDto): CommonResponse {
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

  @Put(':id')
  update(@Param('id') id: number, fundingUpdateDto: FundingUpdateDto) {
    return this.fundingService.update(id, fundingUpdateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.fundingService.remove(id);
  }
}
