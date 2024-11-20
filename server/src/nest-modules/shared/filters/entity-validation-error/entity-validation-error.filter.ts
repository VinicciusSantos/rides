import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { union } from 'lodash';

import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';

@Catch(EntityValidationError)
export class EntityValidationErrorFilter implements ExceptionFilter {
  public catch(exception: EntityValidationError, host: ArgumentsHost): void {
    host
      .switchToHttp()
      .getResponse<Response>()
      .status(HttpStatus.UNPROCESSABLE_ENTITY)
      .json({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        error: 'Unprocessable Entity',
        message: union(
          ...exception.error.reduce(
            (acc, error) =>
              acc.concat(
                //@ts-expect-error - error can be string
                typeof error === 'string'
                  ? [[error]]
                  : [
                      Object.values(error).reduce(
                        (acc, error) => acc.concat(error),
                        [],
                      ),
                    ],
              ),
            [],
          ),
        ),
      });
  }
}
