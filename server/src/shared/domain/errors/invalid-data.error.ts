import { HTTPStatus } from '../services';

export enum ErrorType {
  INVALID_DATA = 'INVALID_DATA',
  INVALID_DRIVER = 'INVALID_DRIVER',
  INVALID_DISTANCE = 'INVALID_DISTANCE',
  DRIVER_NOT_FOUND = 'DRIVER_NOT_FOUND',
  NO_RIDES_FOUND = 'NO_RIDES_FOUND',
}

interface ErrorInfos {
  httpStatus: number;
  message: string;
}

export const errorInfosMap: Record<ErrorType, ErrorInfos> = {
  [ErrorType.INVALID_DATA]: {
    httpStatus: HTTPStatus.BAD_REQUEST,
    message: 'The provided data is invalid',
  },
  [ErrorType.INVALID_DRIVER]: {
    httpStatus: HTTPStatus.BAD_REQUEST,
    message: 'Invalid driver data',
  },
  [ErrorType.DRIVER_NOT_FOUND]: {
    httpStatus: HTTPStatus.NOT_FOUND,
    message: 'Driver not found',
  },
  [ErrorType.INVALID_DISTANCE]: {
    httpStatus: HTTPStatus.NOT_ACCEPTABLE,
    message: 'Invalid distance data',
  },
  [ErrorType.NO_RIDES_FOUND]: {
    httpStatus: HTTPStatus.NOT_FOUND,
    message: 'No rides found',
  },
};

export class InvalidDataError extends Error {
  public readonly httpStatus!: HTTPStatus;

  constructor(type: ErrorType = ErrorType.INVALID_DATA, description?: string) {
    const { httpStatus, message } = errorInfosMap[type];

    super(description || message);

    this.httpStatus = httpStatus;
    this.name = type;
  }
}
