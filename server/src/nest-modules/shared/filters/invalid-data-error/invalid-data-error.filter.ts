import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

import { InvalidDataError } from '../../../../shared/domain/errors';

@Catch(InvalidDataError)
export class InvalidDataErrorFilter implements ExceptionFilter {
  public catch(exception: InvalidDataError, host: ArgumentsHost): void {
    host
      .switchToHttp()
      .getResponse<Response>()
      .status(exception.httpStatus)
      .json({
        error_code: exception.name,
        error_description: exception.message,
        details: exception,
      });
  }
}
