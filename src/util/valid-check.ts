import { Injectable } from "@nestjs/common";
import { GiftogetherExceptions } from "src/filters/giftogether-exception";

@Injectable()
export class ValidCheck{
  constructor(
    private readonly g2gException: GiftogetherExceptions,
  ){}

  async verifyUserMatch(targetUserId: number, originUserId: number):Promise<boolean> {
    if (targetUserId !== originUserId) {
      throw this.g2gException.UserAccessDenied;
    }
    return true;
  }
}