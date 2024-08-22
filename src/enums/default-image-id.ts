/**
 * Funding: 0 ~ 7
 * Gratitude: 8 ~ 15
 * RollingPaper: 16 ~ 23
 * User: 24 ~ 31
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
};

export function getRandomDefaultImgId(defImgArray: DefaultImageId[]): number {
  return defImgArray[Math.floor(Math.random() * defImgArray.length)];
}