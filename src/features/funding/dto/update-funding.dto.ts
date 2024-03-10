import { PartialType } from '@nestjs/mapped-types';
import { CreateFundingDto } from './create-funding.dto';

export class UpdateFundingDto extends PartialType(CreateFundingDto) {}
