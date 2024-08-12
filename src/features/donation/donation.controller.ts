import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DonationService } from './donation.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { CommonResponse } from 'src/interfaces/common-response.interface';

@Controller('donation')
export class DonationController {
  constructor(private donationService: DonationService) {}

  // // 펀딩페이지에서 후원하기 + 롤링페이퍼 등록
  // @Get(':fundUuid')
  // async findOne(@Param('fundUuid', ParseUUIDPipe) fundUuid: string): Promise<CommonResponse> {
  @Post('/:fundUuid')
  async createDonation(
    @Param('fundUuid') fundUuid: string,
    @Body() createDonationDto: CreateDonationDto,
  ): Promise<CommonResponse> {
    try {
      return {
        message: 'Donation 생성 완료',
        data: await this.donationService.createDonation(
          fundUuid,
          createDonationDto,
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  // 마이페이지에서 후원내역 조회
  @Get()
  async getAllDonations() {
    return {
      message: 'Donation list 조회 성공',
      data: await this.donationService.getAllDonations(),
    };
  }

  // 비회원 후원내역 조회
  @Get('/:orderId')
  async getOneDonation(@Param('orderId') orderId: string) {
    return {
      message: 'Donation 조회 성공',
      data: await this.donationService.getOneDonation(orderId),
    };
  }

  // 후원 취소
  @Delete('/:donId')
  async deleteDonation(@Param('donId') donId: number) {
    return {
      message: 'Donation 삭제 성공',
      data: await this.donationService.deleteDonation(donId),
    };
  }
}
