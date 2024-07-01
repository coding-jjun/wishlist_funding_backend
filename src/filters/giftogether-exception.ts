import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ErrorCode } from 'src/enums/error-code.enum';
import { ErrorMsg } from 'src/enums/error-message.enum';

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
  FundingNotExists = new GiftogetherException(
    ErrorMsg.FundingNotExists,
    ErrorCode.FundingNotExists,
    HttpStatus.NOT_FOUND,
  );

  // Donation
  FundingClosed = new GiftogetherException(
    ErrorMsg.FundingClosed,
    ErrorCode.FundingClosed,
    HttpStatus.BAD_REQUEST,
  );

  // Gift
  IncorrectGiftUrl = new GiftogetherException(
    ErrorMsg.IncorrectGiftUrl,
    ErrorCode.IncorrectGiftUrl,
    HttpStatus.BAD_REQUEST,
  );

  // Gratitude
  GratitudeAlreadyExists = new GiftogetherException(
    ErrorMsg.GratitudeAlreadyExists,
    ErrorCode.GratitudeAlreadyExists,
    HttpStatus.FORBIDDEN,
  );
  GratitudeNotExist = new GiftogetherException(
    ErrorMsg.GratitudeNotExist,
    ErrorCode.GratitudeNotExist,
    HttpStatus.NOT_FOUND,
  );

  // RollingPaper

  // Comment

  // Image
  IncorrectImageUrl = new GiftogetherException(
    ErrorMsg.IncorrectImageUrl,
    ErrorCode.IncorrectImageUrl,
    HttpStatus.BAD_REQUEST,
  );

  // User
  UserNotFound = new GiftogetherException(
    ErrorMsg.UserNotFound,
    ErrorCode.UserNotFound,
    HttpStatus.BAD_REQUEST,
  );

  UserNotUpdated = new GiftogetherException(
    ErrorMsg.UserNotUpdated,
    ErrorCode.UserNotUpdated,
    HttpStatus.BAD_REQUEST,
  );

  UserAlreadyDeleted = new GiftogetherException(
    ErrorMsg.UserAlreadyDeleted,
    ErrorCode.UserAlreadyDeleted,
    HttpStatus.BAD_REQUEST,
  );

  NotValidEmail = new GiftogetherException(
    ErrorMsg.NotValidEmail,
    ErrorCode.NotValidEmail,
    HttpStatus.BAD_REQUEST
  )
  NotValidPhone = new GiftogetherException(
    ErrorMsg.NotValidPhone,
    ErrorCode.NotValidPhone,
    HttpStatus.BAD_REQUEST
  )
  NotValidNick = new GiftogetherException(
    ErrorMsg.NotValidNick,
    ErrorCode.NotValidNick,
    HttpStatus.BAD_REQUEST
  )
  PasswordIncorrect = new GiftogetherException(
    ErrorMsg.PasswordIncorrect,
    ErrorCode.PasswordIncorrect,
    HttpStatus.UNAUTHORIZED 
  )

  UserFailedToCreate = new GiftogetherException(
    ErrorMsg.UserFailedToCreate,
    ErrorCode.UserFailedToCreate,
    HttpStatus.FORBIDDEN,
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
  WrongNotiType = new GiftogetherException(
    ErrorMsg.WrongNotiType,
    ErrorCode.WrongNotiType,
    HttpStatus.BAD_REQUEST
  )

  // Auth
  JwtNotExpired = new GiftogetherException(
    ErrorMsg.JwtNotExpired,
    ErrorCode.JwtNotExpired,
    HttpStatus.BAD_REQUEST,
  );
  JwtExpired = new GiftogetherException(
    ErrorMsg.JwtExpired,
    ErrorCode.JwtExpired,
    HttpStatus.UNAUTHORIZED,
  );
  NotValidToken = new GiftogetherException(
    ErrorMsg.NotValidToken,
    ErrorCode.NotValidToken,
    HttpStatus.UNAUTHORIZED,
  );
  TokenMissing = new GiftogetherException(
    ErrorMsg.TokenMissing,
    ErrorCode.TokenMissing,
    HttpStatus.BAD_REQUEST,
  );
  RefreshExpire = new GiftogetherException(
    ErrorMsg.RefreshExpire,
    ErrorCode.RefreshExpire,
    HttpStatus.UNAUTHORIZED,
  );
  UserAlreadyExists = new GiftogetherException(
    ErrorMsg.UserAlreadyExists,
    ErrorCode.UserAlreadyExists,
    HttpStatus.CONFLICT,
  );
  FailedLogout = new GiftogetherException(
    ErrorMsg.FailedLogout,
    ErrorCode.FailedLogout,
    HttpStatus.BAD_REQUEST,
  );
  RedisServerError = new GiftogetherException(
    ErrorMsg.RedisServerError,
    ErrorCode.RedisServerError,
    HttpStatus.CONFLICT,
  );

  // default images
  DefaultImgIdNotExist = new GiftogetherException(
    ErrorMsg.DefaultImgIdNotExist,
    ErrorCode.DefaultImgIdNotExist,
    HttpStatus.NOT_FOUND,
  );
}
