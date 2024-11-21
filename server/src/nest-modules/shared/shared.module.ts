import { Global, Module } from '@nestjs/common';

import {
  HTTP_SERVICE_PROVIDER,
  MAPS_SERVICE_PROVIDER,
} from './shared.providers';

@Global()
@Module({
  providers: [HTTP_SERVICE_PROVIDER, MAPS_SERVICE_PROVIDER],
  exports: [HTTP_SERVICE_PROVIDER.provide, MAPS_SERVICE_PROVIDER.provide],
})
export class SharedModule {}
