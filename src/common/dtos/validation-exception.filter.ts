import { Catch, ArgumentsHost, HttpException, BadRequestException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';

@Catch(HttpException)
export class ValidationExceptionFilter extends BaseExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const errors = exception.getResponse() as Record<string, any>; // Type assertion here

        if (exception instanceof BadRequestException) {
            response.status(status).json({
                statusCode: status,
                message: Array.isArray(errors.message) ? errors.message : [errors.message ?? errors.error],
                data: [],
            });
        } else {
            response.status(status).json({
                statusCode: status,
                message: Array.isArray(errors.message) ? errors.message : [errors.message ?? errors.error],
            });
        }
    }
}
