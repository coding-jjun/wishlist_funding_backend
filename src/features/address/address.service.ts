import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from 'src/entities/address.entity';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addrRepository: Repository<Address>,
  ) {}


  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    const address = new Address();

    address.addrRoad = createAddressDto.addrRoad;
    address.addrDetl = createAddressDto.addrDetl;
    address.addrZip = createAddressDto.addrZip;
    address.addrNick = createAddressDto.addrNick;
    address.isDef = createAddressDto.isDef;
    address.userId = createAddressDto.userId;

    return await this.addrRepository.save(address);
  }

  async findAll(
    userId: number,
  ): Promise<{ result: Address[] }> {
    const addresses = await this.addrRepository
      .createQueryBuilder('addr')
      .where('addr.userId = :userId', {userId})
      .getMany();

    return { result: addresses};
  }

  async update(
    addrId: number,
    updateAddressDto: UpdateAddressDto
  ): Promise<Address> {
    const addr = await this.addrRepository.findOne({ where: {addrId}});
    if (addr) {
      addr.addrNick = updateAddressDto.addrNick;
      addr.isDef = updateAddressDto.isDef;

      return await this.addrRepository.save(addr);
    }
  }


  async remove(
    addrId: number,
  ): Promise<Address> {
    const addr = await this.addrRepository.findOne({ where: {addrId }});
    if (!addr) {
      throw new Error('Address not found');
    }
    try {
      const result = await this.addrRepository.softDelete({ addrId });
      // 예외가 발생하지 않으면 삭제 작업이 성공적으로 수행된 것으로 간주
      return addr;
    } catch (error) {
        // 삭제 작업 중 오류 발생
    }
  
  }
}
