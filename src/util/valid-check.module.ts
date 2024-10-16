import { Module } from '@nestjs/common';
import { ValidCheck } from './valid-check';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { CustomUrlValidator } from './custom-url-validator';

@Module({
  providers: [ValidCheck, GiftogetherExceptions, CustomUrlValidator],
  exports: [ValidCheck, CustomUrlValidator],
})
export class ValidCheckModule {}
