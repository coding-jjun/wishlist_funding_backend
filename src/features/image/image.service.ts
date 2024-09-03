import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  HeadObjectCommand,
  NotFound,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { ImageType } from 'src/enums/image-type.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from 'src/entities/image.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ImageService {
  private readonly s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    maxAttempts: 30,
  });

  private readonly bucketName = process.env.AWS_S3_BUCKET_NAME;

  constructor(
    private readonly g2gException: GiftogetherExceptions,
    @InjectRepository(Image) private readonly imgRepo: Repository<Image>,
  ) {}

  getObjectUrlOf(filename: string): string {
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${filename}`;
  }

  async upload(filename: string, file: Buffer): Promise<string> {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: filename,
        Body: file,
      }),
    );

    return this.getObjectUrlOf(filename);
  }

  /**
   * Image Table에서 레코드 하나를 제거하는 메서드. ImageService를 Inject하여 사용하세요.
   * @param imgType 연관 테이블 타입
   * @param subId FK
   */
  async unlink(imgType: ImageType, subId: number) {
    const image = await this.imgRepo.findOne({
      where: { imgType, subId },
    });
    if (!image) {
      throw this.g2gException.ImageNotFound;
    }
    this.imgRepo.remove(image); // TODO - Soft Delete
  }

  /**
   * S3 버킷에 저장된 객체를 삭제합니다.
   * @param url 삭제하고자 하는 S3 기프투게더 이미지 URL
   */
  async delete(url: string): Promise<void> {
    const regex = /^(https?):\/\/([^\/]+)\/(.*)?$/;
    const matches = url.match(regex);

    if (!matches) {
      this.g2gException.IncorrectImageUrl;
    }

    // const protocol = matches[1];
    const host = matches[2];
    const uri = matches[3];

    if (host !== process.env.AWS_S3_HOST) {
      this.g2gException.IncorrectImageUrl;
    }
    if (!uri) {
      this.g2gException.ImageUriNotSpecified;
    }

    // 파일이 존재하는지 먼저 확인한다.
    await this.s3Client
      .send(
        new HeadObjectCommand({
          Bucket: this.bucketName,
          Key: uri,
        }),
      )
      .catch((e) => {
        if (e instanceof NotFound) {
          throw this.g2gException.ImageNotFound;
        }
        throw e;
      })
      .then(() => {
        // 그리고 마침내 삭제 요청을 보낸다.
        this.s3Client.send(
          new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: uri,
          }),
        );
      });
  }
}
