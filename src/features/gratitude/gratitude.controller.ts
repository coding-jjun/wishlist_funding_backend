import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { GratitudeDto } from './dto/gratitude.dto';
import { GratitudeService } from './gratitude.service';

@Controller('/api/gratitude')
export class GratitudeController {
  constructor(private readonly gratitudeService: GratitudeService) {}
  
  @Get('/:gratId')
  async getGratitude(
    @Param('gratId') gratId: number
  ): Promise<any> {
    return {
      data: await this.gratitudeService.getGratitude(gratId),
    };
  }

  @Post('/:fundUuid')
  async createGratitude(
    @Param('fundUuid') fundUuid: string,
    @Body() createGratitudeDto: GratitudeDto
  ): Promise<any> {
    return {
      message: '감사인사 생성 성공!',
      data: await this.gratitudeService.createGratitude(fundUuid, createGratitudeDto)
    };
  }

  @Put('/:gratId')
  async updateGratitude(
    @Param('gratId') gratId: number,
    @Body() updateGratitudeDto: GratitudeDto
  ): Promise<any> {
    return {
      message: 'success',
      data: await this.gratitudeService.updateGratitude(gratId, updateGratitudeDto),
    };
  }

  @Delete('/:gratId')
  async deleteGratitude(@Param('gratId') gratId: number): Promise<any> {
    return {
      data: await this.gratitudeService.deleteGratitude(gratId),
    };
  }



}
