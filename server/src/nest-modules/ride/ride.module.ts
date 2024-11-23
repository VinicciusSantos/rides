import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import {
  RideEstimationModel,
  RideModel,
} from '../../core/ride/infra/db/sequelize';
import { CustomerModule } from '../customer';
import { DriverModule } from '../driver';
import { RideController } from './ride.controller';
import { RIDE_PROVIDERS } from './ride.providers';

@Module({
  imports: [
    DriverModule,
    CustomerModule,
    SequelizeModule.forFeature([RideModel, RideEstimationModel]),
  ],
  controllers: [RideController],
  providers: [
    ...Object.values(RIDE_PROVIDERS.USE_CASES),
    ...Object.values(RIDE_PROVIDERS.REPOSITORIES),
  ],
  exports: [
    RIDE_PROVIDERS.USE_CASES.CONFIRM_RIDE_USECASE.provide,
    RIDE_PROVIDERS.USE_CASES.ESTIMATE_RIDE_USECASE.provide,
  ],
})
export class RideModule {}
