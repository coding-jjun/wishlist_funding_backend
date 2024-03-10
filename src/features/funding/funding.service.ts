import { Injectable } from '@nestjs/common';
import { Funding } from 'src/entities/funding.entity';

@Injectable()
export class FundingService {
    findOne(id: number): Promise<Array<Funding>> {}
    update(id: number, updateFundingDto) {}
    remove(id: number) {}
}
