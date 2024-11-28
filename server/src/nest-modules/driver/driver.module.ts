import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { DriverModel } from '../../core/driver/infra/db/sequelize';
import { DRIVER_PROVIDERS } from './driver.providers';
import { DriverController } from './driver.controller';

@Module({
  controllers: [DriverController],
  imports: [SequelizeModule.forFeature([DriverModel])],
  providers: [
    ...Object.values(DRIVER_PROVIDERS.REPOSITORIES),
    ...Object.values(DRIVER_PROVIDERS.USECASES),
  ],
  exports: [DRIVER_PROVIDERS.REPOSITORIES.DRIVER_REPOSITORY.provide],
})
export class DriverModule {}
