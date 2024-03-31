import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';

export class UpdateCommentDto extends PickType(CreateCommentDto, [
  'content',
] as const) {}
