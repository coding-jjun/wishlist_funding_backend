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

@Controller('api/fundings')
export class FundingController {
  constructor(private fundingService: FundingService) {}

  @Get()
  findAll() {}

  @Post()
  create(@Body() fundingCreateDto: FundingCreateDto) {}

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
