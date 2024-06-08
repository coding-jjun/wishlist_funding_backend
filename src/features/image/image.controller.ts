import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { CommonResponse } from 'src/interfaces/common-response.interface';
import { ImageDto } from './dto/image.dto';
import * as sharp from 'sharp';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ): Promise<CommonResponse> {
    const uploadedImages = new ImageDto();
    const urls = [];

    for (const file of files) {
      const buffer = await sharp(file.buffer)
        .resize(300)
        .toBuffer();

      const url = await this.imageService.upload(file.originalname, buffer);
      urls.push(url);
    }

    uploadedImages.urls = urls;

    return {
      message: '성공적으로 파일이 업로드 되었습니다.',
      data: uploadedImages,
    };
  }
}
