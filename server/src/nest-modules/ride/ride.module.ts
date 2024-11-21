import { Module } from '@nestjs/common';

import { DriverModule } from '../driver';
import { RideController } from './ride.controller';
import { RIDE_PROVIDERS } from './ride.providers';

@Module({
  imports: [DriverModule],
  controllers: [RideController],
  providers: [...Object.values(RIDE_PROVIDERS.USE_CASES)],
})
export class RideModule {}
