import { getModelToken } from '@nestjs/sequelize';

import {
  DriverModel,
  DriverSequelizeRepository,
} from '../../core/driver/infra/db/sequelize';
import { UnitOfWorkSequelize } from '../../shared/infra/db/sequelize';

export const REPOSITORIES = {
  DRIVER_REPOSITORY: {
    provide: 'DriverRepository',
    useExisting: DriverSequelizeRepository,
  },
  DRIVER_SEQUELIZE_REPOSITORY: {
    provide: DriverSequelizeRepository,
    useFactory: (driverModel: typeof DriverModel, uow: UnitOfWorkSequelize) =>
      new DriverSequelizeRepository(driverModel, uow),
    inject: [getModelToken(DriverModel), 'UnitOfWork'],
  },
};

export const DRIVER_PROVIDERS = {
  REPOSITORIES,
};
