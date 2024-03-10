import { IsDate, IsDateString, Min } from 'class-validator';
import { FundTheme } from 'src/enums/fundtheme.enum';

export class FundingCreateDto {
  fundTitle: string;
  fundCont: string;
  fundImg: string[];
  fundTheme: FundTheme;
  fundPubl: boolean;

  @Min(0)
  fundGoal: number;

  // TODO - FundAddressDto
  // fundAddr: AddressDto

  @IsDateString()
  endAt: string;

  // TODO - GiftCreateDto
  // gifts: GiftCreateDto[]
}
