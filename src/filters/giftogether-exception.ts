import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ErrorCode } from "src/enums/error-code.enum";
import { ErrorMsg } from "src/enums/error-message.enum";

export class GiftogetherException extends HttpException {
  private errCode: string;

  constructor(message: string, errCode: string, status: HttpStatus) {
    super(message, status);
    this.errCode = errCode;
  }

  getErrCode() {
    return this.errCode;
  }
}

@Injectable()
export class GiftogetherExceptions {
  // Funding
  
  // Donation
  
  // Gift
  
  // Gratitude
  
  // RollingPaper
  
  // Comment
  
  // Image
  
  // User
  UserNotFound = new GiftogetherException(
    ErrorMsg.UserNotFound,
    ErrorCode.UserNotFound,
    HttpStatus.BAD_REQUEST,
  );

  // Friend
  AlreadySendRequest = new GiftogetherException(
    ErrorMsg.AlreadySendRequest,
    ErrorCode.AlreadySendRequest,
    HttpStatus.BAD_REQUEST,
  );
  AlreadyFriend = new GiftogetherException(
    ErrorMsg.AlreadyFriend,
    ErrorCode.AlreadyFriend,
    HttpStatus.BAD_REQUEST,
  ); 

  // Notification
}