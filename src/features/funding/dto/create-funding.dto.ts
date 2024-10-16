import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  Min,
  Validate,
  ValidateNested,
} from 'class-validator';
import { FundTheme } from 'src/enums/fund-theme.enum';
import { RequestGiftDto } from 'src/features/gift/dto/request-gift.dto';
import { CustomUrlValidator } from 'src/util/custom-url-validator';

export class CreateFundingDto {
  @IsNotEmpty()
  fundTitle: string;

  @IsNotEmpty()
  fundCont: string;

  @IsOptional()
  @Validate(CustomUrlValidator)
  fundImg?: string;

  @IsNotEmpty()
  fundTheme: FundTheme;

  @IsOptional()
  fundPubl?: boolean;

  @Min(0)
  fundGoal: number;

  @IsNotEmpty()
  fundAddrRoad: string;

  @IsNotEmpty()
  fundAddrDetl: string;

  @IsNotEmpty()
  fundAddrZip: string;

  @IsOptional()
  fundRecvName?: string;

  @IsOptional()
  fundRecvPhone?: string;

  @IsOptional()
  fundRecvReq?: string;

  @IsDateString()
  endAt: Date;

  @ValidateNested({ each: true })
  @Type(() => RequestGiftDto)
  gifts: RequestGiftDto[];
}
