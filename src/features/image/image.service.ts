import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from 'src/entities/image.entity';
import { ImageType } from 'src/enums/image-type.enum';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepo: Repository<Image>,
  ) {}

  async createImages(subId: number, imgType: ImageType, fileNames: string[]): Promise<Image[]>{
    const images: Image[] = [];
    try {
      for (const fileName of fileNames) {
        const image = new Image();
        image.subId = subId;
        image.imgType = imgType;
        // TODO await generate S3 URL
        image.imgUrl = fileName;
        const savedImage = await this.imageRepo.save(image);
        images.push(savedImage);
      }
    }catch(error){
      console.error("Failed to create Images : ", error);
    }
    return images;
  }


  async findImages(subId: number, imgType: ImageType){
    try {
      const images = await this.imageRepo.find({
        where: { subId, imgType },
      });
      return images;
      
    } catch (error) {
      console.error('Failed to find Images : ', error);
      throw error;
    }
  }


}