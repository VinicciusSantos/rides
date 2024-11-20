import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { PingController } from './ping.controller';

describe('PingController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [PingController],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should return pong', () => {
    return request(app.getHttpServer())
      .get('/ping')
      .expect(HttpStatus.OK)
      .expect('pong');
  });
});
