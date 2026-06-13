// http-exception.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const errorResponse = exception.getResponse();
    const message =
      typeof errorResponse === 'object' &&
      errorResponse !== null &&
      'message' in errorResponse
        ? (errorResponse.message as string)
        : exception.message;

    this.logger.error(
      `[${request.method}] ${request.url} - Status: ${status} - Error: ${exception.stack}`,
    );

    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
