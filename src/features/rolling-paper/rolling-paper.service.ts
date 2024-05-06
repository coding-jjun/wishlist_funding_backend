import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RollingPaper } from 'src/entities/rolling-paper.entity';
import { Repository } from 'typeorm';
import { RollingPaperDto } from './dto/rolling-paper.dto';

@Injectable()
export class RollingPaperService {
  constructor(
  
    @InjectRepository(RollingPaper)
    private readonly rollingPaperRepo: Repository<RollingPaper>
  ){}

  async getAllRollingPapers(fundId: number): Promise<RollingPaperDto[]>{

    const rolls = await this.rollingPaperRepo.find({
                  where: {fundId: fundId},
                  relations: ['donation', 'donation.user'],
                });

    return rolls.map(roll=> new RollingPaperDto(roll));
  }


  
}
