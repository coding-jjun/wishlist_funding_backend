import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { CommonResponse } from 'src/interfaces/common-response.interface';

@Catch(HttpException)
export class CommonExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message;
    const timestamp = new Date(Date.now());

    response.status(status).json({
      message,
      timestamp,
      data: null,
    } as CommonResponse);
  }
}
