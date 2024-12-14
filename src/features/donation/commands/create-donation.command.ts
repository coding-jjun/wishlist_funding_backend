import { User } from 'src/entities/user.entity';
import { Funding } from 'src/entities/funding.entity';

export class CreateDonationCommand {
  constructor(
    readonly funding: Funding,
    readonly amount: number,
    readonly donor: User,
  ) {}
}
