export class CreateProvisionalDonationCommand {
  constructor(
    readonly senderSig: string,
    readonly senderUserId: number,
    readonly amount: number,
    readonly fundUuid: string, // 여기에선 UUID 검사할 필요 없습니다. DTO가 다 해결했으니 안심하세요.
  ) {}
}
