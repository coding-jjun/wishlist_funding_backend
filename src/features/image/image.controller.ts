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

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1_000_000 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ): Promise<CommonResponse> {
    const uploadedImages: ImageDto[] = [];

    for (const file of files) {
      const imagedto: ImageDto = await this.imageService.upload(
        file.originalname,
        file.buffer,
      );
      uploadedImages.push(imagedto);
    }

    return {
      message: '성공적으로 파일이 업로드 되었습니다.',
      data: uploadedImages,
    };
  }
}
