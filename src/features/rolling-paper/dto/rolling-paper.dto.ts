import { RollingPaper } from 'src/entities/rolling-paper.entity';
export class RollingPaperDto {
  rollId: number;
  rollMsg: string;
  regAt: Date;
  donAmnt: number;
  userNick: string;

  constructor(rollingPaper: RollingPaper) {
    this.rollId = rollingPaper.rollId;
    this.rollMsg = rollingPaper.rollMsg;
    // rollImg;
    this.regAt = rollingPaper.donation.regAt;
    this.donAmnt = rollingPaper.donation.donAmnt;
    this.userNick = rollingPaper.donation.user.userNick;
    // userImage
  }
}
