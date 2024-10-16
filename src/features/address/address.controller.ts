import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { CommonResponse } from 'src/interfaces/common-response.interface';
import { AddressDto } from './dto/address.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth-guard';
import { User } from 'src/entities/user.entity';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createAddressDto: CreateAddressDto,
    @Req() req: Request
  ): Promise<CommonResponse> {
    const user = req.user as { user: User } as any;
    const address = await this.addressService.create(createAddressDto, user);

    return {
      message: '배송지를 추가하였습니다.',
      data: new AddressDto(address),
    };
  }

  @Get(':addrId')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('addrId', ParseIntPipe) addrId: number,
    @Req() req: Request
  ): Promise<CommonResponse> {    
    const user = req.user as { user: User } as any;
    try {
      const address = await this.addressService.findOne(addrId, user.userId);
      return {
        message: '배송지 조회에 성공하였습니다.',
        data: new AddressDto(address),
      };
    } catch (error) {
      throw error;
    }
  }

  @Put(':addrId')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('addrId', ParseIntPipe) addrId: number,
    @Body() updateAddressDto: UpdateAddressDto,
    @Req() req: Request
  ): Promise<CommonResponse> {
    const user = req.user as { user: User } as any;
    const address = await this.addressService.update(addrId, updateAddressDto, user.userId);

    return {
      message: '배송지 정보를 갱신하였습니다.',
      data: new AddressDto(address),
    };
  }

  @Delete(':addrId')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('addrId', ParseIntPipe) addrId: number,
    @Req() req: Request
  ): Promise<CommonResponse> {
    const user = req.user as { user: User } as any;
    const address = await this.addressService.remove(addrId, user.userId);
    return {
      message: '배송지를 삭제하였습니다.',
      data: new AddressDto(address),
    };
  }
}
