import { IsUrl } from 'class-validator';
import { ValidatorConfig } from 'src/config/validator.config';

export class UrlDto {
  @IsUrl(ValidatorConfig.IsUrlOptions)
  url: string;
}
