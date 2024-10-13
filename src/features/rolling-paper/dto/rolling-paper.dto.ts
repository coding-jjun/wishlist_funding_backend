import { RollingPaper } from 'src/entities/rolling-paper.entity';
import { IsUrl } from 'class-validator';
import { ValidatorConfig } from 'src/config/validator.config';
export class RollingPaperDto {
  rollId: number;
  rollMsg: string;
  regAt: Date;
  donAmnt: number;
  userNick: string;

  @IsUrl(ValidatorConfig.IsUrlOptions)
  rollImg: string;

  constructor(rollingPaper: RollingPaper, rollImg: string) {
    this.rollId = rollingPaper.rollId;
    this.rollMsg = rollingPaper.rollMsg;
    this.rollImg = rollImg;
    this.regAt = rollingPaper.donation.regAt;
    this.donAmnt = rollingPaper.donation.donAmnt;
    this.userNick = rollingPaper.donation.user.userNick;
  }
}
