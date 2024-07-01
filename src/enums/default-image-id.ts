/**
 * Funding: 0 ~ 7
 * Gratitude: 8 ~ 15
 * RollingPaper: 16 ~ 23
 * User: 24 ~ 31
 */
export enum DefaultImageId {
  Funding = 0,
  Funding2 = 1,
  Funding3 = 2,
  Gratitude = 8,
  Gratitude2 = 9,
  Gratitude3 = 10,
  RollingPaper = 16,
  RollingPaper2 = 17,
  RollingPaper3 = 18,
  User = 24,
  User2 = 25,
  User3 = 26,
}

export const defaultUserImageIds = [
  DefaultImageId.User,
  DefaultImageId.User2,
  DefaultImageId.User3,
];

export const defaultGratitudeImageIds = [
  DefaultImageId.Gratitude,
  DefaultImageId.Gratitude2,
  DefaultImageId.Gratitude3,
];

export const defaultRollingPaperImageIds = [
  DefaultImageId.RollingPaper,
  DefaultImageId.RollingPaper2,
  DefaultImageId.RollingPaper3,
]

export const defaultFundingImageIds = [
  DefaultImageId.Funding,
  DefaultImageId.Funding2,
  DefaultImageId.Funding3,
]