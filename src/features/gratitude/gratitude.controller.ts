import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { GratitudeDto } from './dto/gratitude.dto';
import { GratitudeService } from './gratitude.service';
import { CommonResponse } from 'src/interfaces/common-response.interface';
import { Gratitude } from 'src/entities/gratitude.entity';

@Controller('gratitude')
export class GratitudeController {
  constructor(private readonly gratitudeService: GratitudeService) {}

  @Get('/:fundUuid')
  async getGratitude(
    @Param('fundUuid', ParseUUIDPipe) fundUuid: string,
  ): Promise<CommonResponse> {
    const data = await this.gratitudeService.getGratitude(fundUuid);
    return { data };
  }

  @Post('/:fundUuid')
  async createGratitude(
    @Param('fundUuid', ParseUUIDPipe) fundUuid: string,
    @Body() createGratitudeDto: GratitudeDto,
  ): Promise<CommonResponse> {
    return {
      message: '감사인사 생성 성공!',
      data: await this.gratitudeService.createGratitude(
        fundUuid,
        createGratitudeDto,
      ),
    };
  }

  @Put('/:fundUuid')
  async updateGratitude(
    @Param('fundUuid', ParseUUIDPipe) fundUuid: string,
    @Body() updateGratitudeDto: GratitudeDto,
  ): Promise<CommonResponse> {
    return {
      message: 'success',
      data: await this.gratitudeService.updateGratitude(
        fundUuid,
        updateGratitudeDto,
      ),
    };
  }

  @Delete('/:gratId')
  async deleteGratitude(
    @Param('gratId') gratId: number,
  ): Promise<CommonResponse> {
    return {
      data: await this.gratitudeService.deleteGratitude(gratId),
    };
  }
}
