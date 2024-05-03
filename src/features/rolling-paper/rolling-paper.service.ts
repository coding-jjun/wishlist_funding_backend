import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Funding } from 'src/entities/funding.entity';
import { RollingPaper } from 'src/entities/rolling-paper.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RollingPaperService {
  constructor(
  
    @InjectRepository(RollingPaper)
    private readonly rollingPaperRepo: Repository<RollingPaper>,
  
    @InjectRepository(Funding)
    private readonly fundingRepo: Repository<Funding>,
  
  ){}

  async getAllRollingPapers(fundUuid: string){
    const fundId = (await this.fundingRepo.findOne({ where: {fundUuid}})).fundId;
    return await this.rollingPaperRepo.find({where: { fundId: fundId }});
  }


  
}
