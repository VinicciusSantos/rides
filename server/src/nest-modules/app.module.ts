import { Module } from '@nestjs/common';

import { DatabaseModule } from './database';
import { DriverModule } from './driver';
import { PingModule } from './ping';
import { RideModule } from './ride';
import { SharedModule } from './shared';

@Module({
  imports: [DatabaseModule, SharedModule, DriverModule, PingModule, RideModule],
})
export class AppModule {}
