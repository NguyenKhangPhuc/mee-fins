// zod-exception.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ZodValidationException } from 'nestjs-zod';

@Catch(ZodValidationException)
export class ZodExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ZodExceptionFilter.name);

  catch(exception: ZodValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const zodError = exception.getZodError() as {
      issues: { path: (string | number)[]; message: string }[];
    };

    this.logger.error(
      `[${request.method}] ${request.url} - Status: ${HttpStatus.BAD_REQUEST} - Zod Validation Error`,
    );

    response.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: zodError.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
      code: 'ZOD_VALIDATION_ERROR',
    });
  }
}
