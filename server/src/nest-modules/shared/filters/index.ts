import { ExceptionFilter } from '@nestjs/common';

import { EntityValidationErrorFilter } from './entity-validation-error';
import { HttpRequestFailedErrorFilter } from './http-request-failed-error';
import { InvalidDataErrorFilter } from './invalid-data-error';
import { NotFoundErrorFilter } from './not-found-error';

export const APPLICATION_FILTERS: ExceptionFilter[] = [
  new EntityValidationErrorFilter(),
  new HttpRequestFailedErrorFilter(),
  new InvalidDataErrorFilter(),
  new NotFoundErrorFilter(),
];
