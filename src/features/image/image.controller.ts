import {
  Controller,
  FileTypeValidator,
  Logger,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { CommonResponse } from 'src/interfaces/common-response.interface';
import { timestamp } from 'rxjs';
import { ImageDto } from './dto/image.dto';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100_000 }),
          new FileTypeValidator({ fileType: 'image' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<CommonResponse> {
    const imagedto: ImageDto = await this.imageService.upload(file.originalname, file.buffer);

    return {
      timestamp: new Date(Date.now()),
      message: '성공적으로 파일이 업로드 되었습니다.',
      data: imagedto,
    };
  }
}
