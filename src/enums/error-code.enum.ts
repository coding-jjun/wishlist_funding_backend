export enum ErrorCode {
  // Funding
  FundingNotExists = '0000',

  // Donation

  // Gift
  IncorrectGiftUrl = '0200',

  // Gratitude
  GratitudeAlreadyExists = '0300',
  GratitudeNotExist = '0301',

  // RollingPaper

  // Comment

  // Image
  IncorrectImageUrl = '0600',

  // User
  UserNotFound = '0700',
  UserNotUpdated = '0701',
  UserAlreadyDeleted = '0702',
  UserFailedToCreate = '0703',

  // Friend
  AlreadySendRequest = '0800',
  AlreadyFriend = '0801',

  // Notification

  // Jwt
  JwtNotExpired = '0900',
  JwtExpired = '0901',
  NotValidToken = '0902',
  TokenMissing = '0903',
  RefreshExpire = '0904',
  UserAlreadyExists = '0905',
  FailedLogout = '0906',
  RedisServerError = '0907',

  // default image
  DefaultImgIdNotExist = '1000',
}
