import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  isURL,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';

/**
 * Custom validator implementation to check if a given string is a valid URL.
 * Uses the `isURL` function from the 'Validator' library with configuration options retrieved from the ConfigService.
 */
@ValidatorConstraint({ name: 'CustomUrlValidator', async: true })
@Injectable()
export class CustomUrlValidator implements ValidatorConstraintInterface {
  constructor(
    private readonly g2gException: GiftogetherExceptions,
    private readonly configService: ConfigService,
  ) {}

  validate(
    url: string,
    _validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    const options = this.configService.get('isUrlOptions');
    return isURL(url, options);
  }

  defaultMessage?(_validationArguments?: ValidationArguments): string {
    return this.g2gException.InvalidUrl.message;
  }
}
