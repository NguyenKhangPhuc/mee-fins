// all-exceptions.filter.ts — chỉ còn lo lỗi unknown
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.logger.error(
      `[${request.method}] ${request.url} - Status: ${HttpStatus.INTERNAL_SERVER_ERROR} - Error: ${
        exception instanceof Error ? exception.stack : JSON.stringify(exception)
      }`,
    );

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: 'Server crashes, please try again later',
    });
  }
}
