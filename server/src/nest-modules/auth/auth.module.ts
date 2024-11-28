import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AUTH_SERVICE_PROVIDER, USE_CASES } from './auth.providers';

@Module({
  controllers: [AuthController],
  providers: [...Object.values(USE_CASES), AUTH_SERVICE_PROVIDER],
  exports: [AUTH_SERVICE_PROVIDER.provide],
})
export class AuthModule {}
