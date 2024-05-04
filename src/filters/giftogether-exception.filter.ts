import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { CommonResponse } from 'src/interfaces/common-response.interface';
import { GiftogetherException } from './giftogether-exception';
import { DataSource, Repository } from 'typeorm';
import { GiftogetherError } from 'src/entities/error.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { request } from 'http';

@Catch()
export class GiftogetherExceptionFilter implements ExceptionFilter {
  constructor(
    @InjectRepository(GiftogetherError)
    private readonly errRepository: Repository<GiftogetherError>,
    private readonly logger: Logger,
  ) {}

  async catch(exception: GiftogetherException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const msg = exception.message;
    const stack  = exception.stack;
    const err = new GiftogetherError();

    this.logger.error(stack);
    
    if (!(exception instanceof HttpException)) {
      err.httpCode = HttpStatus.INTERNAL_SERVER_ERROR;
    } else {
      err.httpCode = exception.getStatus();
      if (exception.name === 'GiftogetherException')
        err.errCode = exception.getErrCode();
    }


    res.status(err.httpCode).json({
      timestamp: new Date(),
      message: msg,
      data: null,
    } as CommonResponse);

    try {
      err.method = req.method;
      err.url = req.url;
      err.agent = req.headers['user-agent'];
      err.ip = req.referrer;
      err.parameters = req.body.toString();
      err.errName = exception.name;
      err.errStack = stack;

      await this.errRepository.save(err);
    } catch (error) {
      
    }
  }
}
