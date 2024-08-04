import { Module } from '@nestjs/common';
import { ValidCheck } from './valid-check';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';

@Module({
  providers: [ValidCheck, GiftogetherExceptions],
  exports: [ValidCheck],
})
export class ValidCheckModule {}