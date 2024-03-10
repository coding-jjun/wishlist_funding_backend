import { IsDate, IsDateString, Min } from 'class-validator';
import { Funding } from 'src/entities/funding.entity';
import { FundTheme } from 'src/enums/fund-theme.enum';

export class CreateFundingDto {
  fundTitle: string;
  fundCont: string;
  fundImg: string[];
  fundTheme?: FundTheme;
  fundPubl?: boolean;

  @Min(0)
  fundGoal: number;

  // TODO - FundAddressDto
  // fundAddr: AddressDto

  @IsDate()
  endAt: Date;

  // TODO - GiftCreateDto
  // gifts: GiftCreateDto[]
}
