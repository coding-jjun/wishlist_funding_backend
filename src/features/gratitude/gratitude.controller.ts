import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CommonResponse } from 'src/interfaces/common-response.interface';
import { GratitudeDto } from './dto/gratitude.dto';
import { GratitudeService } from './gratitude.service';

@Controller('gratitude')
export class GratitudeController {
  constructor(private readonly gratitudeService: GratitudeService) {}
  
  @Get('/:gratId')
  getGratitude(@Param('gratId') gratId: number): CommonResponse {
    const data = this.gratitudeService.getGratitude(gratId);
    return {
      timestamp: new Date(Date.now()),
      message: 'success',
      data: data,
    };
  }

  @Post('/:fundUuid')
  async createGratitude(@Param('fundUuid') fundUuid: string,
                  @Body() createGratitudeDto: GratitudeDto): Promise<CommonResponse> {
    return {
      timestamp: new Date(Date.now()),
      message: '감사인사 생성 성공!',
      data: await this.gratitudeService.createGratitude(fundUuid, createGratitudeDto)
    };
  }

  @Put('/:gratId')
  updateGratitude(@Param('gratId') gratId: number,
                  @Body() updateGratitudeDto: GratitudeDto): CommonResponse {
    const data = this.gratitudeService.updateGratitude(gratId, updateGratitudeDto);
    return {
      timestamp: new Date(Date.now()),
      message: 'success',
      data: data,
    };
  }

  @Delete('/:gratId')
  deleteGratitude(@Param('gratId') gratId: number): CommonResponse {
    const data = this.gratitudeService.deleteGratitude(gratId);
    return {
      timestamp: new Date(Date.now()),
      message: 'success',
      data: data,
    };
  }



}
