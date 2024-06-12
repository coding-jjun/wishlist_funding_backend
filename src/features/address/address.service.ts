import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Not, Repository } from 'typeorm';
import { Address } from 'src/entities/address.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addrRepository: Repository<Address>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    const address = new Address();

    address.addrRoad = createAddressDto.addrRoad;
    address.addrDetl = createAddressDto.addrDetl;
    address.addrZip = createAddressDto.addrZip;
    address.addrNick = createAddressDto.addrNick;
    address.recvName = createAddressDto.recvName;
    address.recvPhone = createAddressDto.recvPhone;
    address.recvReq = createAddressDto.recvReq;
    address.isDef = createAddressDto.isDef;

    const user = await this.userRepository.findOne({
      where: { userId: createAddressDto.userId },
    });
    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }

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

  async findAll(userId: number): Promise<Address[]> {
    const addresses = await this.addrRepository
      .createQueryBuilder('addr')
      .select([
        'addr.addrId',
        'addr.addrNick',
        'addr.addrRoad',
        'addr.addrDetl',
        'addr.addrZip',
        'addr.recvName',
        'addr.recvPhone',
        'addr.recvReq',
        'addr.isDef',
      ])
      .where('addr.userId = :userId', { userId })
      .getMany();

    return addresses;
  }

  async findOne(addrId: number): Promise<Address> {
    const addr = await this.addrRepository.findOneBy({ addrId });
    if (!addr) {
      throw new NotFoundException('배송지를 조회할 수 없습니다.');
    }

    return addr;
  }

  async update(
    addrId: number,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    const addr = await this.addrRepository.findOne({
      where: { addrId },
      relations: ['addrUser']
    });
    if (!addr) {
      throw new NotFoundException('배송지를 조회할 수 없습니다.');
    }

    if (updateAddressDto.isDef && !addr.isDef) {
      const defaultAddr = await this.addrRepository.findOne({
        where: {
          addrUser: { userId: addr.addrUser.userId },
          isDef: true
        }
      });
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

  async remove(addrId: number): Promise<Address> {
    const addr = await this.addrRepository.findOne({
      where: { addrId },
      relations: ['addrUser']
    });
    if (!addr) {
      throw new NotFoundException('배송지를 조회할 수 없습니다.');
    }
    try {
      const result = await this.addrRepository.delete({ addrId });
      return addr;
    } catch (error) {
    }
  }
}
