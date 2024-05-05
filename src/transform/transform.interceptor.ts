import { CallHandler, ExecutionContext, Injectable, NestInterceptor, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map, timestamp } from 'rxjs';
import { CommonResponse } from 'src/interfaces/common-response.interface';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
        map(response => {
            // 응답 객체에서 메시지와 데이터 추출
            const message = response.message || 'Success';
            const data = response.data;

            return {
                timestamp: new Date(),
                message: message,
                data: data
            };
        })
    );
}
}

