import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ImageDto } from './dto/image.dto';

@Injectable()
export class ImageService {
  private readonly s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    maxAttempts: 30,
  });

  getObjectUrlOf(filename: string): string {
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${filename}`;
  }

  async upload(filename: string, file: Buffer): Promise<ImageDto> {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: filename,
        Body: file,
      }),
    );

    return {
      url: this.getObjectUrlOf(filename),
    };
  }
}

/**
 *
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
*/
