import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  ValidateNested,
} from 'class-validator';
import { Funding } from 'src/entities/funding.entity';
import { FundTheme } from 'src/enums/fund-theme.enum';
import { RequestGiftDto } from 'src/features/gift/dto/request-gift.dto';

export class CreateFundingDto {
  @IsNotEmpty()
  fundTitle: string;

  @IsNotEmpty()
  fundCont: string;

  // /**
  //  * fundImg와 defaultImgId 둘 중에 하나만 null이어야 함
  //  */
  // @IsOptional()
  // @IsUrl({}, { each: true })
  // fundImg?: string[];

  // /**
  //  * fundImg와 defaultImgId 둘 중에 하나만 null이어야 함
  //  */
  // @IsNumber()
  // @IsOptional()
  // defaultImgId?: number;

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
