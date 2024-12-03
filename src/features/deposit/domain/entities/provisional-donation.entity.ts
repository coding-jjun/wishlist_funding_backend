/**
 * TODO - 현재 PoC를 위한 엔티티입니다. `@Entity` 데코레이터를 나중에 등록해야 합니다.
 */
export class ProvisionalDonation {
  constructor(
    public readonly id: string,
    public readonly sender: string,
    public readonly amount: number,
    public status: 'PENDING' | 'APPROVED' | 'REJECTED',
  ) {}

  approve(): void {
    this.status = 'APPROVED';
  }

  reject(): void {
    this.status = 'REJECTED';
  }
}
