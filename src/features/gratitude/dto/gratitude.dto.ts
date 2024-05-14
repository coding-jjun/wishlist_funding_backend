import { IsNotEmpty, IsUrl } from 'class-validator';

export class GratitudeDto {
  @IsNotEmpty()
  gratTitle: string;

  @IsNotEmpty()
  gratCont: string;

  @IsNotEmpty()
  @IsUrl({}, { each: true })
  gratImg: string[];

  constructor(gratTitle: string, gratCont: string, gratImg?: string[]) {
    this.gratTitle = gratTitle;
    this.gratCont = gratCont;
    this.gratImg = gratImg || [];
  }
}
