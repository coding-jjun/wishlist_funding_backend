import { IsUrl } from 'class-validator';

export class ImageDto {
  @IsUrl({}, { each: true })
  urls: string[];
}
