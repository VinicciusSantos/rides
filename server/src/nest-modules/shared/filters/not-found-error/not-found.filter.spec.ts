import { Controller, Get, HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { Entity } from '../../../../shared/domain';
import { NotFoundError } from '../../../../shared/domain/errors';
import { ValueObject } from '../../../../shared/domain/value-objects';
import { NotFoundErrorFilter } from './not-found-error.filter';

class StubEntity extends Entity {
  public get entity_id(): ValueObject {
    throw new Error('Method not implemented.');
  }

  public toJSON(): Record<string, unknown> {
    throw new Error('Method not implemented.');
  }
}

@Controller('stub')
class StubController {
  @Get()
  public index(): void {
    throw new NotFoundError('fake id', StubEntity);
  }
}

describe('NotFoundErrorFilter Unit Tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [StubController],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new NotFoundErrorFilter());
    await app.init();
  });

  it('should catch a EntityValidationError', () => {
    return request(app.getHttpServer())
      .get('/stub')
      .expect(HttpStatus.NOT_FOUND)
      .expect({
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: 'StubEntity not found using ID fake id',
      });
  });
});
