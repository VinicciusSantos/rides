import {
  ClassSerializerInterceptor,
  HttpStatus,
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { APPLICATION_FILTERS } from './shared';
import { ErrorType, InvalidDataError } from '../shared/domain/errors';

export function applyGlobalConfig(app: INestApplication) {
  app.enableCors({ allowedHeaders: '*', origin: '*', credentials: true });

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        throw new InvalidDataError(
          ErrorType.INVALID_DATA,
          errors
            .map((error) => Object.values(error.constraints || {}))
            .flat()
            .join(', '),
        );
      },
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalFilters(...APPLICATION_FILTERS);
}
