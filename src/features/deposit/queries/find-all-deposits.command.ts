import { DepositStatus } from 'src/enums/deposit-status.enum';
import { Sorting } from 'src/interfaces/sorting.interface';

export class FindAllDepositsCommand {
  constructor(
    readonly status?: DepositStatus,
    readonly sort?: Sorting,
    readonly limit?: number,
    readonly lastDepositId?: number,
  ) {}
}
