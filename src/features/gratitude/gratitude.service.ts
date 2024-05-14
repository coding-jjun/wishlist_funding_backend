import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gratitude } from 'src/entities/gratitude.entity';
import { Repository } from 'typeorm';
import { GratitudeDto } from './dto/gratitude.dto';
import { Funding } from 'src/entities/funding.entity';
import { Image } from 'src/entities/image.entity';
import { ImageType } from 'src/enums/image-type.enum';

@Injectable()
export class GratitudeService {
  constructor(
    @InjectRepository(Gratitude)
    private readonly gratitudeRepo: Repository<Gratitude>,

    @InjectRepository(Funding)
    private readonly fundingRepo: Repository<Funding>,
    
    @InjectRepository(Image)
    private readonly imgRepo: Repository<Image>,
  ) {}
  
  async getGratitude(fundUuid: string){
    // TODO find all image url
    const funding = await this.fundingRepo.findOne({ where: { fundUuid } });
    return this.gratitudeRepo.findOne({ where: { gratId: funding.fundId }});
  }

  async createGratitude(fundUuid: string, gratitudeDto: GratitudeDto) {
    const funding = await this.fundingRepo.findOne({ where: {fundUuid}});

    const grat = await this.gratitudeRepo.save(new Gratitude(funding.fundId,
                                                      gratitudeDto.gratTitle,
                                                      gratitudeDto.gratCont));
    this.imgRepo.save(
      gratitudeDto.gratImg.map(
        (url) => new Image(url, ImageType.Gratitude, grat.gratId),
      ),
    );
    
    return grat;
  }
  
  async updateGratitude(gratId: number, gratitudeDto: GratitudeDto) {
    const gratitude = await this.gratitudeRepo.findOneBy({gratId});
    gratitude.gratTitle = gratitudeDto.gratTitle;
    gratitude.gratCont = gratitudeDto.gratCont;
    // TODO update gratitude image
    return await this.gratitudeRepo.save(gratitude);
  }


  async deleteGratitude(gratId: number){
    const gratitude = await this.gratitudeRepo.findOneBy({gratId});
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
