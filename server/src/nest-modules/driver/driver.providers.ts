import { getModelToken } from '@nestjs/sequelize';

import {
  DriverModel,
  DriverSequelizeRepository,
} from '../../core/driver/infra/db/sequelize';
import { UnitOfWorkSequelize } from '../../shared/infra/db/sequelize';
import { GetDriversUsecase } from '../../core/driver/application/usecases';
import { IDriverRepository } from '../../core/driver/domain';

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

export const USECASES = {
  GET_DRIVERS_USECASE: {
    provide: GetDriversUsecase,
    useFactory: (driverRepo: IDriverRepository) =>
      new GetDriversUsecase(driverRepo),
    inject: [REPOSITORIES.DRIVER_REPOSITORY.provide],
  },
};

export const DRIVER_PROVIDERS = {
  REPOSITORIES,
  USECASES,
};
