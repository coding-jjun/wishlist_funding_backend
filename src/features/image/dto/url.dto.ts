import { IsUrl } from 'class-validator';

export class UrlDto {
  @IsUrl()
  url: string;
}
