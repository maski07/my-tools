import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class CommonExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(CommonExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let field: string | undefined;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            message = typeof exceptionResponse === 'string'
                ? exceptionResponse
                : (exceptionResponse as any).message || exception.message;
            field = (exceptionResponse as any).field;
        } else if (exception instanceof Error) {
            message = exception.message;
        }

        const errorResponse = {
            statusCode: status,
            message,
            ...(field && { field }),
            timestamp: new Date().toISOString(),
            path: request.url,
        };

        // Log the error
        this.logger.error(
            `${request.method} ${request.url} - ${status} - ${message}`,
            exception instanceof Error ? exception.stack : undefined
        );

        response.status(status).json(errorResponse);
    }
} 