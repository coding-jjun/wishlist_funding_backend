import * as ValidatorJs from 'validator';

export class ValidatorConfig {
  public static get IsUrlOptions(): ValidatorJs.IsURLOptions {
    if (process.env['DEBUG']) {
      return {};
    }
    return {
      require_protocol: true,
      protocols: ['https'],
      require_host: true,
      require_port: false,
      host_blacklist: [/\*/],
      host_whitelist: ['giftogether2.s3.ap-northeast-2.amazonaws.com'],
    };
  }
}
