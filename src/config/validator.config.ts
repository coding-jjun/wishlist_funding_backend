import * as ValidatorJs from 'validator';

export function isUrlOptions(): ValidatorJs.IsURLOptions {
  console.log(process.env['DEBUG']);
  console.log(process.env['AWS_S3_HOST']);
  if (process.env['DEBUG']) {
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
