export class GetGratitudeDto {
  constructor(
    public readonly fundId: number,
    public readonly gratTitle: string,
    public readonly gratCont: string,
    public readonly imgUrl: string[],
  ) {}
}
