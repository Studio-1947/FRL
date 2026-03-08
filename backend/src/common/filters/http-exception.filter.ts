import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error('Unhandled Exception:', exception);
    }

    const message =
      exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

    // Formulate a structured error response
    response.status(status).json({
      statusCode: status,
      message: typeof message === 'object' && message['message'] ? message['message'] : message,
      error:
        typeof message === 'object' && message['error']
          ? message['error']
          : exception instanceof Error
            ? exception.message
            : undefined,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
