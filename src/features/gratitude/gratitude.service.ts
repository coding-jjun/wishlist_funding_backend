import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Donation } from 'src/entities/donation.entity';
import { Gratitude } from 'src/entities/gratitude.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { GratitudeDto } from './dto/gratitude.dto';

@Injectable()
export class GratitudeService {
  constructor(
    @InjectRepository(Gratitude)
    private readonly gratitudeRepo: Repository<Gratitude>,
  ) {}
  
  async getGratitude(gratId: number){
    const gratitude = await this.gratitudeRepo.findOne({where: {gratId}});
    // TODO find all image url
    return gratitude;
  }

  async createGratitude(gratId: number, gratitudeDto: GratitudeDto) {
    const gratitude = await this.createOrUpdateGratitude(gratId, gratitudeDto);
    // TODO create gratitude image url
    return gratitude;
  }
  
  async updateGratitude(gratId: number, gratitudeDto: GratitudeDto) {
    const gratitude = this.createOrUpdateGratitude(gratId, gratitudeDto, true);
    // TODO update gratitude image
    return gratitude;
  }
  
  private async createOrUpdateGratitude(gratId: number, gratitudeDto: GratitudeDto, isUpdate: boolean = false): Promise<Gratitude> {
    let gratitude: Gratitude;
    
    if (isUpdate) {
      gratitude = await this.gratitudeRepo.findOne({where: {gratId}});
    } else {
      gratitude = new Gratitude();
      gratitude.gratId = gratId;
    }  
    gratitude.gratTitle = gratitudeDto.gratTitle;
    gratitude.gratCont = gratitudeDto.gratCont;
    await this.gratitudeRepo.save(gratitude);
    
    return gratitude;
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
