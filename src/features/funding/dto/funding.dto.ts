import { ResponseGiftDto } from 'src/features/gift/dto/response-gift.dto';

export class FundingDto {
  constructor(
    public fundId: number,
    public fundUuid: string,
    public fundTitle: string,
    public fundCont: string,
    public fundTheme: string,
    public fundPubl: boolean,
    public fundGoal: number,
    public fundSum: number,
    public fundAddrRoad: string,
    public fundAddrDetl: string,
    public fundAddrZip: string,
    public fundRecvName: string,
    public fundRecvPhone: string,
    public regAt: Date,
    public endAt: Date,
    public fundUserId: number,
    public fundUserNick: string,
    public fundUserImg: string,
    public fundImgUrls?: string[], // 펀딩 자체의 이미지와 선물 목록의 이미지를 모두 포함합니다.
    public fundRecvReq?: string,
    public gifts?: ResponseGiftDto[],
  ) {}
}
