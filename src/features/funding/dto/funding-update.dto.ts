import { PartialType } from '@nestjs/mapped-types';
import { FundingCreateDto } from './funding-create.dto';

export class FundingUpdateDto extends PartialType(FundingCreateDto) {}
