import { RollingPaper } from 'src/entities/rolling-paper.entity';
import { Validate } from 'class-validator';
import { CustomUrlValidator } from 'src/util/custom-url-validator';
export class RollingPaperDto {
  rollId: number;
  rollMsg: string;
  regAt: Date;
  donAmnt: number;
  userNick: string;

  @Validate(CustomUrlValidator)
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
