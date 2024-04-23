import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gratitude } from 'src/entities/gratitude.entity';
import { Repository } from 'typeorm';
import { GratitudeDto } from './dto/gratitude.dto';
import { Funding } from 'src/entities/funding.entity';

@Injectable()
export class GratitudeService {
  constructor(
    @InjectRepository(Gratitude)
    private readonly gratitudeRepo: Repository<Gratitude>,

    @InjectRepository(Funding)
    private readonly fundingRepo: Repository<Funding>,
  ) {}
  
  async getGratitude(gratId: number){
    const gratitude = await this.gratitudeRepo.findOne({where: {gratId}});
    // TODO find all image url
    return gratitude;
  }

  async createGratitude(fundUuid: string, gratitudeDto: GratitudeDto) {
    const funding = await this.fundingRepo.findOne({ where: {fundUuid}});

    const savedgratitude 
          = await this.gratitudeRepo.save(new Gratitude(funding,
                                                        gratitudeDto.gratTitle,
                                                        gratitudeDto.gratCont));

    const { funding: ignoredFunding, ...gratitude } = savedgratitude;

    return gratitude;
    // TODO create gratitude image url
  }
  
  async updateGratitude(gratId: number, gratitudeDto: GratitudeDto) {
    const gratitude = await this.gratitudeRepo.findOne({where: {gratId}});
    gratitude.gratTitle = gratitudeDto.gratTitle;
    gratitude.gratCont = gratitudeDto.gratCont;
    // TODO update gratitude image
    return await this.gratitudeRepo.save(gratitude);
  }


  async deleteGratitude(gratId: number){
    const gratitude = await this.gratitudeRepo.findOne({where: {gratId}});
    if (gratitude) {
      console.log(gratitude);
      gratitude.isDel = true;
      // TODO delete gratitude Images
      await this.gratitudeRepo.save(gratitude);
      return true;
    } else {
      return false;
    }
  }
  
  
}
