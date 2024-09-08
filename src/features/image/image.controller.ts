import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CommonResponse } from 'src/interfaces/common-response.interface';
import { ImageDto } from './dto/image.dto';
import { v4 as uuidv4 } from 'uuid';
import * as sharp from 'sharp';
import { JwtAuthGuard } from '../auth/guard/jwt-auth-guard';
import { UrlDto } from './dto/url.dto';
import { S3Service } from './s3.service';

@Controller('image')
export class ImageController {
  constructor(private readonly s3Service: S3Service) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(JwtAuthGuard)
  async uploadFiles(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
      }),
    )
    files: Express.Multer.File[],
  ): Promise<CommonResponse> {
    const uploadedImages = new ImageDto();
    const urls = [];

    for (const file of files) {
      const buffer = await sharp(file.buffer).resize(300).toBuffer();

      const regex = /\.([0-9a-z]+)(?:[\?#]|$)/i;
      const match = file.originalname.match(regex);
      const extension = match[1];

      const filename = uuidv4() + '.' + extension;

      const url = await this.s3Service.upload(filename, buffer);
      urls.push(url);
    }

    uploadedImages.urls = urls;

    return {
      message: '성공적으로 파일이 업로드 되었습니다.',
      data: uploadedImages,
    };
  }

  /**
   * 파일 URL로부터 파일명을 추출한 다음
   * 데이터베이스에 저장이 되어있는지 확인한 후
   * S3에 저장된 파일을 포함하여 제거합니다.
   * @authorization JWT Bearer Token
   * @param imgUrl 제거하고자 하는 이미지의 파일 URL
   */
  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteFile(@Body() urlDto: UrlDto): Promise<CommonResponse> {
    const { url } = urlDto;

    await this.s3Service.delete(url);

    return {
      message: '성공적으로 파일이 삭제되었습니다.',
      data: null,
    };
  }
}
