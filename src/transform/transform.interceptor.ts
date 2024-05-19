import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { getNow } from 'src/app.module';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        // 응답 객체에서 메시지와 데이터 추출
        const message = response.message || 'Success';
        const data = response.data;

        return {
          timestamp: getNow(),
          message: message,
          data: data,
        };
      }),
    );
  }
}
