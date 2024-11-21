import { Module } from '@nestjs/common';

import { CustomerModule } from './customer';
import { DatabaseModule } from './database';
import { DriverModule } from './driver';
import { PingModule } from './ping';
import { RideModule } from './ride';
import { SharedModule } from './shared';

@Module({
  imports: [
    DatabaseModule,
    SharedModule,
    CustomerModule,
    DriverModule,
    PingModule,
    RideModule,
  ],
})
export class AppModule {}
