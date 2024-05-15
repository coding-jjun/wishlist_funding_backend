import { Funding } from 'src/entities/funding.entity';
import { ResponseGiftDto } from 'src/features/gift/dto/response-gift.dto';

export class FundingDto {
  fundId: number;
  fundUuid: string;
  fundUser: number;
  fundTitle: string;
  fundCont: string;
  fundTheme: string;
  fundPubl: boolean;
  fundGoal: number;
  fundSum: number;
  regAt: Date;
  endAt: Date;
  gifts: ResponseGiftDto[];
  fundImgUrls: string[];

  constructor(
    funding: Funding,
    gifts?: ResponseGiftDto[],
    fundImgUrls?: string[],
  ) {
    this.fundId = funding.fundId;
    this.fundUuid = funding.fundUuid;
    this.fundUser = funding.fundUser?.userId;
    this.fundTitle = funding.fundTitle;
    this.fundCont = funding.fundCont;
    this.fundTheme = funding.fundTheme;
    this.fundPubl = funding.fundPubl;
    this.fundGoal = funding.fundGoal;
    this.fundSum = funding.fundSum;
    this.regAt = funding.regAt;
    this.endAt = funding.endAt;
    this.gifts = gifts || [];
    this.fundImgUrls = fundImgUrls || [];
  }
}
