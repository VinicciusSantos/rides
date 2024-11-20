import { HTTPStatus } from '../services/http';

export class HttpRequestFailedError extends Error {
  constructor(
    message: string,
    public readonly statusCode: HTTPStatus,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'HttpRequestFailedError';
  }
}
