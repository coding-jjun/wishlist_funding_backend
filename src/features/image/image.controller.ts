import {
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { CommonResponse } from 'src/interfaces/common-response.interface';
import { ImageDto } from './dto/image.dto';
import { v4 as uuidv4 } from 'uuid';
import * as sharp from 'sharp';
import { JwtAuthGuard } from '../auth/guard/jwt-auth-guard';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

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

      const url = await this.imageService.upload(filename, buffer);
      urls.push(url);
    }

    uploadedImages.urls = urls;

    return {
      message: '성공적으로 파일이 업로드 되었습니다.',
      data: uploadedImages,
    };
  }
}
