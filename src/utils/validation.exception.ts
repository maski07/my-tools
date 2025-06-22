import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
    constructor(message: string, field?: string) {
        super(
            {
                statusCode: HttpStatus.BAD_REQUEST,
                message,
                field,
                timestamp: new Date().toISOString(),
            },
            HttpStatus.BAD_REQUEST
        );
    }
} 