import {
  DeleteObjectCommand,
  HeadObjectCommand,
  NotFound,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3Service {
  constructor(private readonly g2gException: GiftogetherExceptions) {
    this.s3Client = new S3Client({
      region: process.env.AWS_S3_REGION,
      maxAttempts: 30,
    });
  }
  private readonly s3Client: S3Client;

  private readonly bucketName = process.env.AWS_S3_BUCKET_NAME;

  async upload(filename: string, file: Buffer): Promise<string> {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: filename,
        Body: file,
      }),
    );

    return `https://${process.env['AWS_S3_HOST']}/${filename}`;
  }

  /**
   * S3 버킷에 저장된 객체를 삭제합니다.
   * @param url 삭제하고자 하는 S3 기프투게더 이미지 URL
   */
  async delete(url: string): Promise<void> {
    const regex = /^(https?):\/\/([^\/]+)\/(.*)?$/;
    const matches = url.match(regex);

    if (!matches || matches.length !== 4) {
      throw this.g2gException.IncorrectImageUrl;
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
