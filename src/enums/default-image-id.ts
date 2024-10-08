/**
 * Gift: 1 ~ 7
 * Gratitude: 8 ~ 15
 * RollingPaper: 16 ~ 23
 * User: 24 ~ 31
 * Funding: 32 ~ 39
 */
export enum DefaultImageId {
  Gift = 1,
  Gift2 = 2,
  Gift3 = 3,
  Gratitude = 8,
  Gratitude2 = 9,
  Gratitude3 = 10,
  RollingPaper = 16,
  RollingPaper2 = 17,
  RollingPaper3 = 18,
  User = 24,
  User2 = 25,
  User3 = 26,
  Funding = 32,
  Funding2 = 33,
  Funding3 = 34,
}

export const DefaultImageIds = {
  User: [
    DefaultImageId.User,
    DefaultImageId.User2,
    DefaultImageId.User3,
  ],
  Gratitude: [
    DefaultImageId.Gratitude,
    DefaultImageId.Gratitude2,
    DefaultImageId.Gratitude3,
  ],
  RollingPaper: [
    DefaultImageId.RollingPaper,
    DefaultImageId.RollingPaper2,
    DefaultImageId.RollingPaper3,
  ],
  Gift: [
    DefaultImageId.Gift,
    DefaultImageId.Gift2,
    DefaultImageId.Gift3,
  ],
  Funding: [
    DefaultImageId.Funding,
    DefaultImageId.Funding2,
    DefaultImageId.Funding3,
  ],
};

export function getRandomDefaultImgId(defImgArray: DefaultImageId[]): number {
  return defImgArray[Math.floor(Math.random() * defImgArray.length)];
}