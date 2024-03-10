import { Controller, Get, Post, Param, Body, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { DonationService } from './donation.service';
import { CreateDonationDto } from './dto/create-donation.dto';

@Controller('donation')
export class DonationController {
    constructor(private donationService: DonationService){}

    // 펀딩페이지에서 후원하기 + 롤링페이퍼 등록 
    @Post('/:fundId')
    async createDonation(
        @Param('fundId') fundId: number,
        @Body() createDonationDto: CreateDonationDto
    ){
        try {
            const data = await this.donationService.createDonation(fundId, createDonationDto);
            return { timeStamp: new Date(),message: 'Success', data };
        } catch (error) {
            throw new HttpException('Failed to create donation', HttpStatus.BAD_REQUEST);
        }
    }


    // 마이페이지에서 후원내역 조회
    @Get()
    async getAllDonations(){
        try {
            const data = await this.donationService.getAllDonations();
            return { timeStamp: new Date(), message: 'Success', data };
        } catch (error) {
            throw new HttpException('Failed to get donations', HttpStatus.BAD_REQUEST);
        }
    }


    // 비회원 후원내역 조회
    @Get('/:orderId')
    async getOneDonation(@Param('orderId') orderId: string){
        try {
            const data = await this.donationService.getOneDonation(orderId);
            return { timeStamp: new Date(), message: 'Success', data };
        } catch (error) {
            throw new HttpException('Failed to get one donation', HttpStatus.BAD_REQUEST);
        }
    }


    // 후원 취소
    @Delete('/:donId')
    async deleteDonation(@Param('donId') donId: number){
        const result = await this.donationService.deleteDonation(donId);
        if (result){
            return { timeStamp: new Date(), message: 'Success' };
        }
        throw new HttpException('Failed to delete donation', HttpStatus.NOT_FOUND);
    }
}