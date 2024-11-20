import { Controller, Get, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { HttpRequestFailedError } from '../../../../shared/domain/errors';
import { HTTPStatus } from '../../../../shared/domain/services';
import { HttpRequestFailedErrorFilter } from './http-request-failed-error.filter';

const testMessage = 'Error in HTTP request';
const testStatusCode = HTTPStatus.I_AM_A_TEAPOT;

@Controller('stub')
class StubController {
  @Get()
  public index(): void {
    throw new HttpRequestFailedError(testMessage, testStatusCode);
  }
}

describe('NotFoundErrorFilter Unit Tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [StubController],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new HttpRequestFailedErrorFilter());
    await app.init();
  });

  it('should catch a EntityValidationError', () => {
    return request(app.getHttpServer())
      .get('/stub')
      .expect(testStatusCode)
      .expect({
        statusCode: testStatusCode,
        error: 'Error in external HTTP request',
        message: testMessage,
      });
  });
});
