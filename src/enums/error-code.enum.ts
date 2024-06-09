export enum ErrorCode {
  // Funding

  // Donation

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
  UserAlreadyExists = '0905'
}
