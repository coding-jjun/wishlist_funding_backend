import { IsNotEmpty, IsNumber, IsOptional, IsUrl } from 'class-validator';

export class GratitudeDto {
  @IsNotEmpty()
  gratTitle: string;

  @IsNotEmpty()
  gratCont: string;

  /*
   * fundImg와 defaultImgId 둘 중에 하나만 null이어야 함
   */
  @IsNotEmpty()
  @IsUrl({}, { each: true })
  gratImg: string[];

  /*
   * fundImg와 defaultImgId 둘 중에 하나만 null이어야 함
   */
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
