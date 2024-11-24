import { ImageType } from 'src/enums/image-type.enum';

/**
 * 이 인터페이스는 엔티티가 이미지와 연관관계를 가질 경우
 * defaultImgId 와 subId 사이에 하나를 배타적으로 사용하는
 * 로직을 추상화하기 위해 만들어졌습니다. 자세한 고민은
 * JIRA의 WISH-340에서 확인할 수 있습니다.
 */
export interface IImageId {
  defaultImgId?: number;
  get imgSubId(): number;
  imageType: ImageType;
}
