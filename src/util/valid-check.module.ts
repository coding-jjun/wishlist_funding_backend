import { Module } from '@nestjs/common';
import { ValidCheck } from './valid-check';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';
import { ConfigService } from '@nestjs/config';
import { CustomUrlValidator } from './custom-url-validator';

@Module({
  providers: [
    ValidCheck,
    GiftogetherExceptions,
    ConfigService,
    CustomUrlValidator,
  ],
  exports: [ValidCheck, CustomUrlValidator],
})
export class ValidCheckModule {}
