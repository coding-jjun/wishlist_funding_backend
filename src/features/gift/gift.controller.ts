import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { CommonResponse } from "src/interfaces/common-response.interface";
import { CreateGiftDto } from "./dto/create-gift.dto";
import { UpdateGiftDto } from "./dto/update-gift.dto";

@Controller('api/gift')
export class GiftController {
  constructor(private giftService: GiftService) {}

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
      throw new HttpException(
        'Failed to get gifts',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post()
  async createGift(
    @Body() createGiftDto: CreateGiftDto
  ): Promise<CommonResponse> {
    try {
      return {
        timestamp: new Date(),
        message: 'Success',
        data: await this.giftService.createGift(createGiftDto),
      }
    } catch (error) {
      throw new HttpException(
        'Failed to create gift',
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  @Put(':giftId')
  async updateGift(
    @Param('giftId') giftId: number,
    @Body() updateGiftDto: UpdateGiftDto
  ): Promise<CommonResponse> {
    try {
      return {
        timestamp: new Date(),
        message: 'Success',
        data: await this.giftService.updateGift(giftId, updateGiftDto),
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
    @Param('giftId') giftId: number
  ): Promise<CommonResponse> {
    try {
      return {
        timestamp: new Date(),
        message: 'Success',
        data: await this.giftService.deleteGift(giftId),
      }
    } catch (error) {
      throw new HttpException(
        'Failed to delete gift',
        HttpStatus.BAD_REQUEST,
      )
    }
  }
}