import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { CommonResponse } from 'src/interfaces/common-response.interface';
import { GiftService } from './gift.service';
import { RequestGiftDto } from './dto/request-gift.dto';

@Controller('gift')
export class GiftController {
  constructor(private readonly giftService: GiftService) {}

  // @Get(':fundId')
  // async findAllGift(@Param('fundId') fundId: number): Promise<CommonResponse> {
  //   try {
  //     return {
  //       data: await this.giftService.findAllGift(fundId),
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // @Put(':giftId')
  // async updateGift(
  //   @Param('giftId', ParseIntPipe) giftId: number,
  //   @Body() requestGiftDto: RequestGiftDto,
  // ): Promise<CommonResponse> {
  //   try {
  //     return {
  //       message: 'Success',
  //       data: await this.giftService.updateGift(giftId, requestGiftDto),
  //     };
  //   } catch (error) {
  //     throw new HttpException('Failed to update gift', HttpStatus.BAD_REQUEST);
  //   }
  // }

  @Delete(':giftId')
  async deleteGift(
    @Param('giftId', ParseIntPipe) giftId: number,
  ): Promise<CommonResponse> {
    try {
      return {
        data: await this.giftService.deleteGift(giftId),
      };
    } catch (error) {
      throw error;
    }
  }
}
