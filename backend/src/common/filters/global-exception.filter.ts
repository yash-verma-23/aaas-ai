import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { isProductionEnv } from '../utils/node-env.util';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const logger = new Logger(GlobalExceptionFilter.name);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Determine status code
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extract the error message
    const exceptionResponse: any =
      exception instanceof HttpException ? exception.getResponse() : null;

    let message = 'Something went wrong';
    if (status !== HttpStatus.INTERNAL_SERVER_ERROR) {
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : exceptionResponse?.message || message;
    }

    const stack = exception.stack;
    const errorDetails = exceptionResponse?.errorDetails;

    const errorResponse = {
      message: message,
      error: exceptionResponse?.error || exception.name || 'Error',
      statusCode: status,
      errorDetails,
      stack,
    };

    logger.error('Exception caught:', stack);
    if (errorDetails) {
      logger.error('Error details:', errorDetails);
    }

    if (isProductionEnv()) {
      delete errorResponse.stack;
    }
    // Send the response
    response.status(status).json(errorResponse);
  }
}
