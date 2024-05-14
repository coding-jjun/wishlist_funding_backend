import { IsDate, IsDateString, IsUrl, Min } from 'class-validator';
import { Funding } from 'src/entities/funding.entity';
import { FundTheme } from 'src/enums/fund-theme.enum';
import { RequestGiftDto } from 'src/features/gift/dto/request-gift.dto';

export class CreateFundingDto {
  fundTitle: string;
  fundCont: string;
  @IsUrl({}, { each: true })
  fundImg: string[];
  fundTheme?: FundTheme;
  fundPubl?: boolean;

  @Min(0)
  fundGoal: number;

  // TODO - FundAddressDto
  // fundAddr: AddressDto

  @IsDateString()
  endAt: Date;

  // TODO - GiftCreateDto
  gifts: RequestGiftDto[];
}
