import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, ParseUUIDPipe, Post, Put, ValidationPipe } from "@nestjs/common";
import { CommonResponse } from "src/interfaces/common-response.interface";
import { GiftArray, RequestGiftDto } from "./dto/request-gift.dto";
import { GiftService } from "./gift.service";
import { FundingService } from "../funding/funding.service";

@Controller('api/gift')
export class GiftController {
  constructor(
    private readonly giftService: GiftService,
  ) {}

  @Get(':fundId')
  async findAllGift(
    @Param('fundId') fundId: number,
  ): Promise<CommonResponse> {
    try {
      const data = await this.giftService.findAllGift(fundId);

      return {
        timestamp: new Date(),
        message: 'Success',
        data
      }
    } catch (error) {
      throw error
    }
  }

  // @Post(':fundUuid')
  // async createOrUpdateGift(
  //   @Param('fundUuid', ParseUUIDPipe) fundUuid: string,
  //   @Body() giftArray: GiftArray,
  // ): Promise<CommonResponse> {
  //   const funding = await this.fundingService.findOne(fundUuid);

  //   try {
  //     return {
  //       timestamp: new Date(),
  //       message: 'Success',
  //       data: await this.giftService.createOrUpdateGift(funding.fundId, giftArray.gifts),
  //     }
  //   } catch (error) {
  //     throw error
  //   }
  // }

  @Put(':giftId')
  async updateGift(
    @Param('giftId', ParseIntPipe) giftId: number,
    @Body() requestGiftDto: RequestGiftDto
  ): Promise<CommonResponse> {
    try {
      return {
        timestamp: new Date(),
        message: 'Success',
        data: await this.giftService.updateGift(giftId, requestGiftDto),
      }
    } catch (error) {
      throw new HttpException(
        'Failed to update gift',
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  @Delete(':giftId')
  async deleteGift(
    @Param('giftId', ParseIntPipe) giftId: number
  ): Promise<CommonResponse> {
    try {
      return {
        timestamp: new Date(),
        message: 'Success',
        data: await this.giftService.deleteGift(giftId),
      }
    } catch (error) {
      throw error;
    }
  }
}