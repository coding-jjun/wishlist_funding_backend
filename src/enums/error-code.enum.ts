export enum ErrorCode {
  // Funding

  // Donation
  FundingClosed = '0100',

  // Gift
  IncorrectGiftUrl = '0200',

  // Gratitude
  GratitudeAlreadyExists = '0300',

  // RollingPaper

  // Comment

  // Image
  IncorrectImageUrl = '0600',

  // User
  UserNotFound = '0700',
  UserNotUpdated = '0701',
  UserAlreadyDeleted = '0702',
  NotValidEmail = "0703",
  NotValidPhone = "0704",
  NotValidNick = "0705",
  PasswordIncorrect = "0705",

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
}
