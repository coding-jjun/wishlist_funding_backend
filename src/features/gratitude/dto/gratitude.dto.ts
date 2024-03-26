import { IsNotEmpty } from 'class-validator';

export class GratitudeDto {

  @IsNotEmpty()
  gratTitle: string;

  @IsNotEmpty()
  gratCont: string;

  @IsNotEmpty()
  gratImg: string[];
}
