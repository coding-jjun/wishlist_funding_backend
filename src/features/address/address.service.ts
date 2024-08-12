import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from 'src/entities/address.entity';
import { User } from 'src/entities/user.entity';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { AddressDto } from './dto/address.dto';
import { ValidCheck } from 'src/util/valid-check';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addrRepository: Repository<Address>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly g2gException: GiftogetherExceptions,
    private readonly validCheck: ValidCheck,
  ) {}

  async create(createAddressDto: CreateAddressDto, user: User): Promise<Address> {
    const address = new Address();

    address.addrRoad = createAddressDto.addrRoad;
    address.addrDetl = createAddressDto.addrDetl;
    address.addrZip = createAddressDto.addrZip;
    address.addrNick = createAddressDto.addrNick;
    address.recvName = createAddressDto.recvName;
    address.recvPhone = createAddressDto.recvPhone;
    address.recvReq = createAddressDto.recvReq;
    address.isDef = createAddressDto.isDef;
    address.addrUser = user;

    if (createAddressDto.recvName) {
      address.recvName = createAddressDto.recvName;
    } else {
      address.recvName = user.userName;
    }

    if (createAddressDto.recvPhone) {
      address.recvPhone = createAddressDto.recvPhone;
    } else {
      address.recvPhone = user.userPhone;
    }

    if (createAddressDto.isDef) {
      const defaultAddr = await this.addrRepository.findOne({
        where: {
          addrUser: { userId: user.userId },
          isDef: true
        },
      });
      if (defaultAddr) {
        defaultAddr.isDef = false;
        await this.addrRepository.save(defaultAddr);
      }
    }

    return await this.addrRepository.save(address);
  }

  async findAll(userId: number): Promise<AddressDto[]> {
    const addresses = await this.addrRepository
      .createQueryBuilder('addr')
      .where('addr.userId = :userId', { userId })
      .getMany();
  
    const result = addresses.map(address => new AddressDto(address, userId));
  
    return result;
  }

  async findOne(addrId: number, userId: number): Promise<Address> {
    const addr = await this.addrRepository.findOne({
      where: { addrId },
      relations: ['addrUser']
    });
    await this.validCheck.verifyUserMatch(addr.addrUser.userId, userId);

    if (!addr) {
      throw this.g2gException.AddressNotFound;
    }

    return addr;
  }

  async update(
    addrId: number,
    updateAddressDto: UpdateAddressDto,
    userId: number
  ): Promise<Address> {
    const addr = await this.addrRepository.findOne({
      where: { addrId },
      relations: ['addrUser']
    });
    if (!addr) {
      throw new NotFoundException('배송지를 조회할 수 없습니다.');
    }

    await this.validCheck.verifyUserMatch(addr.addrUser.userId, userId);

    if (updateAddressDto.isDef && !addr.isDef) {
      // 기존의 기본 배송지
      const defaultAddr = await this.addrRepository.findOne({
        where: {
          addrUser: { userId: userId },
          isDef: true
        }
      });
      // 기존의 기본 배송지를 false 로 변경
      if (defaultAddr) {
        defaultAddr.isDef = false;
        await this.addrRepository.save(defaultAddr);
      }
    }

    addr.addrNick = updateAddressDto.addrNick;
    addr.addrRoad = updateAddressDto.addrRoad;
    addr.addrDetl = updateAddressDto.addrDetl;
    addr.addrZip = updateAddressDto.addrZip;
    addr.recvName = updateAddressDto.recvName;
    addr.recvPhone = updateAddressDto.recvPhone;
    addr.recvReq = updateAddressDto.recvReq;
    addr.isDef = updateAddressDto.isDef;

    return await this.addrRepository.save(addr);
  }

  async remove(addrId: number, userId: number): Promise<Address> {
    const addr = await this.addrRepository.findOne({
      where: { addrId },
      relations: ['addrUser']
    });
    if (!addr) {
      throw new NotFoundException('배송지를 조회할 수 없습니다.');
    }
    await this.validCheck.verifyUserMatch(addr.addrUser.userId, userId);

    try {
      const result = await this.addrRepository.delete({ addrId });
      return addr;
    } catch (error) {
    }
  }
}
