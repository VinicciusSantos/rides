import { Controller, Get, INestApplication, Query } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import {
  errorInfosMap,
  ErrorType,
  InvalidDataError,
} from '../../../../shared/domain/errors';
import { InvalidDataErrorFilter } from './invalid-data-error.filter';

@Controller('stub')
class StubController {
  @Get()
  public index(
    @Query('error') error: ErrorType,
    @Query('message') message?: string,
  ): void {
    throw new InvalidDataError(error, message);
  }
}

describe('NotFoundErrorFilter Unit Tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [StubController],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new InvalidDataErrorFilter());
    await app.init();
  });

  describe.each(Object.keys(ErrorType))('%s error', (errorType) => {
    const error = errorInfosMap[errorType as ErrorType];

    it(`should catch the ${errorType} error`, () => {
      return request(app.getHttpServer())
        .get(`/stub?error=${errorType}`)
        .expect(error.httpStatus)
        .expect((res) =>
          expect(res.body).toEqual(
            expect.objectContaining({
              error_code: errorType,
              error_description: error.message,
              details: expect.any(Object),
            }),
          ),
        );
    });

    it(`should catch the ${errorType} error with a custom message`, () => {
      const customMessage = 'Custom message';
      return request(app.getHttpServer())
        .get(`/stub?error=${errorType}&message=${customMessage}`)
        .expect(error.httpStatus)
        .expect((res) =>
          expect(res.body).toEqual(
            expect.objectContaining({
              error_code: errorType,
              error_description: customMessage,
              details: expect.any(Object),
            }),
          ),
        );
    });
  });
});
