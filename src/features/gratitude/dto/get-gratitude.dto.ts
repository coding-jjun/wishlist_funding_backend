export class GetGratitudeDto {
  constructor(
    public readonly fundUuid: string,
    public readonly gratTitle: string,
    public readonly gratCont: string,
    public readonly imgUrl: string[],
  ) {}
}
