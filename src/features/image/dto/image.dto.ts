import { IsUrl } from 'class-validator';
import { ValidatorConfig } from 'src/config/validator.config';

export class ImageDto {
  @IsUrl(ValidatorConfig.IsUrlOptions, { each: true })
  urls: string[];
}
