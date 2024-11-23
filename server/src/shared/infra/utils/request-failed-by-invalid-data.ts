import { HttpRequestFailedError } from '../../domain/errors';
import { HTTPStatus } from '../../domain/services';

/***
 * Check if the request failed because of invalid data
 * @param error - The error to be checked
 * @returns A boolean indicating if the request failed because of invalid data
 */
export const requestFailedByInvalidData = (error: unknown): boolean =>
  error instanceof HttpRequestFailedError &&
  error.statusCode === HTTPStatus.BAD_REQUEST;
