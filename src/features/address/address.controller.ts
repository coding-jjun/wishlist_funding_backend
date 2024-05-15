import { Controller, Get, Post, Body, Patch, Param, Delete, Put, ParseIntPipe, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { CommonResponse } from 'src/interfaces/common-response.interface';
import { createDecipheriv } from 'crypto';
import { AddressDto } from './dto/address.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}
  @Post()
  async create(
    @Body() createAddressDto: CreateAddressDto
  ): Promise<CommonResponse> {
    const address = await this.addressService.create(createAddressDto);

    return {
      message: '배송지를 추가하였습니다.',
      data: new AddressDto(address),
    };
  }

  @Get(':addrId')
  async findOne(
    @Param('addrId', ParseIntPipe) addrId: number,
  ): Promise<CommonResponse> {
    const address = await this.addressService.findOne(addrId);

    try {
      return {
        message: '배송지 조회에 성공하였습니다.',
        data: new AddressDto(address),
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
    const address = await this.addressService.update(addrId, updateAddressDto);

    return {
      message: '배송지 정보를 갱신하였습니다.',
      data: new AddressDto(address),
    };
  }

  @Delete(':addrId')
  async remove(
    @Param('addrId', ParseIntPipe) addrId: number,
    ): Promise<CommonResponse> {
      const address = await this.addressService.remove(addrId);
      
      return {
        message: '배송지를 삭제하였습니다.',
        data: new AddressDto(address),
      };
  }
}
