import {
  isURL,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as ValidatorJs from 'validator';

export function isUrlOptions(): ValidatorJs.IsURLOptions {
  if (process.env['DEBUG'] === 'true') {
    return {};
  }
  return {
    require_protocol: true,
    protocols: ['https'],
    require_host: true,
    require_port: false,
    host_blacklist: [/\*/],
    host_whitelist: [process.env['AWS_S3_HOST']],
  };
}

/**
 * Custom validator implementation to check if a given string is a valid URL.
 * Uses the `isURL` function from the 'Validator' library with configuration options retrieved from the ConfigService.
 */
@ValidatorConstraint({ name: 'CustomUrlValidator', async: true })
export class CustomUrlValidator implements ValidatorConstraintInterface {
  async validate(
    url: string,
    _validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    return isURL(url, isUrlOptions());
  }

  defaultMessage?(_validationArguments?: ValidationArguments): string {
    return '유효한 URL이 아닙니다.';
  }
}
