import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GratitudeDto } from './dto/gratitude.dto';
import { GratitudeService } from './gratitude.service';
import { CommonResponse } from 'src/interfaces/common-response.interface';
import { JwtAuthGuard } from '../auth/guard/jwt-auth-guard';
import { User } from 'src/entities/user.entity';
import { Request } from 'express';

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
  @UseGuards(JwtAuthGuard)
  async createGratitude(
    @Param('fundUuid', ParseUUIDPipe) fundUuid: string,
    @Body() createGratitudeDto: GratitudeDto,
    @Req() req: Request,
  ): Promise<CommonResponse> {
    const user = req.user as User;
    return {
      message: '감사인사 생성 성공!',
      data: await this.gratitudeService.createGratitude(
        fundUuid,
        createGratitudeDto,
        user,
      ),
    };
  }

  @Put('/:fundUuid')
  @UseGuards(JwtAuthGuard)
  async updateGratitude(
    @Param('fundUuid', ParseUUIDPipe) fundUuid: string,
    @Body() updateGratitudeDto: GratitudeDto,
    @Req() req: Request,
  ): Promise<CommonResponse> {
    const user = req.user as User;
    return {
      message: 'success',
      data: await this.gratitudeService.updateGratitude(
        fundUuid,
        updateGratitudeDto,
        user,
      ),
    };
  }

  @Delete('/:fundUuid')
  @UseGuards(JwtAuthGuard)
  async deleteGratitude(
    @Param('fundUuid', ParseUUIDPipe) fundUuid: string,
    @Req() req: Request,
  ): Promise<CommonResponse> {
    const user = req.user as User;
    return {
      message: '감사인사 삭제 성공했습니다',
      data: await this.gratitudeService.deleteGratitude(fundUuid, user),
    };
  }
}
