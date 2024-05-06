import { Controller, Get, Post, Body, Patch, Param, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('api/address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async create(
    @Body() createAddressDto: CreateAddressDto
  ): Promise<any> {
    return {
      message: '배송지를 추가하였습니다.',
      data: await this.addressService.create(createAddressDto),
    };
  }

  @Get(':userId')
  async findAll(
    @Param('userId') userId: number,
  ): Promise<any> {
    return {
      message: '성공적으로 생성했습니다.',
      data: await this.addressService.findAll(userId),
    };
  }

  @Put('addrId')
  async update(
    @Param('addrId', ParseIntPipe) addrId: number,
    @Body() updateAddressDto: UpdateAddressDto
  ): Promise<any> {
    return {
      message: '배송지 정보를 갱신하였습니다.',
      data: await this.addressService.update(addrId, updateAddressDto)
    };
  }

  @Delete('addrId')
  async remove(
    @Param('addrId', ParseIntPipe) addrId: number,
    ): Promise<any> {
      return {
        message: '배송지를 삭제하였습니다.',
        data: await this.addressService.remove(addrId),
      };
  }
}
