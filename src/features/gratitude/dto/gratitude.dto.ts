import { IsNotEmpty, IsNumber, IsOptional, IsUrl } from 'class-validator';

export class GratitudeDto {
  @IsNotEmpty()
  gratTitle: string;

  @IsNotEmpty()
  gratCont: string;

  @IsNotEmpty()
  @IsUrl({}, { each: true })
  gratImg: string[];

  @IsNumber()
  @IsOptional()
  defaultImgId?: number;

  constructor(gratTitle: string, gratCont: string, gratImg?: string[], defaultImgId?: number) {
    this.gratTitle = gratTitle;
    this.gratCont = gratCont;
    this.gratImg = gratImg || [];
    this.defaultImgId = defaultImgId;
  }
}
