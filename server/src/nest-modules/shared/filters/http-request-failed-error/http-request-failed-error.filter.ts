import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

import { HttpRequestFailedError } from '../../../../shared/domain/errors';

@Catch(HttpRequestFailedError)
export class HttpRequestFailedErrorFilter implements ExceptionFilter {
  public catch(exception: HttpRequestFailedError, host: ArgumentsHost): void {
    host
      .switchToHttp()
      .getResponse<Response>()
      .status(exception.statusCode)
      .json({
        statusCode: exception.statusCode,
        error: 'Error in external HTTP request',
        message: exception.message,
      });
  }
}
