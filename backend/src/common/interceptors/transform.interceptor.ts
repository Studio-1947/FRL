import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // If the response is a string (like HTML), don't wrap it
        if (typeof data === 'string') {
          return data;
        }
        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: 'Success',
          data,
        };
      }),
    );
  }
}
