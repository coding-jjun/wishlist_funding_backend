import { Controller, Get, Post, Body, Patch, Param, Delete, Put, ParseIntPipe, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { CommonResponse } from 'src/interfaces/common-response.interface';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}
  @Post()
  async create(
    @Body() createAddressDto: CreateAddressDto
    ): Promise<CommonResponse> {
    const result = await this.addressService.create(createAddressDto);
    
    return {
      timestamp: new Date(Date.now()),
      message: '배송지를 추가하였습니다.',
      data: result
    };
  }

  @Get(':addrId')
  async findOne(
    @Param('addrId', ParseIntPipe) addrId: number,
  ): Promise<CommonResponse> {
    const address = await this.addressService.findOne(addrId);
    try {
      return {
        timestamp: new Date(),
        message: '배송지 조회에 성공하였습니다.',
        data: address,
      }
    } catch (error) {
      throw new HttpException(
        '배송지 조회에 실패하였습니다',
        HttpStatus.BAD_REQUEST
      )
    }
  }

  @Put(':addrId')
  async update(
    @Param('addrId', ParseIntPipe) addrId: number,
    @Body() updateAddressDto: UpdateAddressDto
  ): Promise<CommonResponse> {
    const result = await this.addressService.update(addrId, updateAddressDto);

    return {
      timestamp: new Date(Date.now()),
      message: '배송지 정보를 갱신하였습니다.',
      data: result,
    };
  }

  @Delete(':addrId')
  async remove(
    @Param('addrId', ParseIntPipe) addrId: number,
    ): Promise<CommonResponse> {
      const result = await this.addressService.remove(addrId);

      return {
        timestamp: new Date(Date.now()),
        message: '배송지를 삭제하였습니다.',
        data: result,
      };
  }
}
