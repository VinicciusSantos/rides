import { getModelToken } from '@nestjs/sequelize';

import { ICustomerRepository } from '../../core/customer/domain';
import { IDriverRepository } from '../../core/driver/domain';
import {
  ConfirmRideUsecase,
  EstimateRideUsecase,
} from '../../core/ride/application/usecases';
import { IRideRepository } from '../../core/ride/domain';
import {
  RideEstimationModel,
  RideModel,
  RideSequelizeRepository,
} from '../../core/ride/infra/db/sequelize';
import { IUnitOfWork } from '../../shared/domain/repository';
import { IMapsService } from '../../shared/domain/services';
import { UnitOfWorkSequelize } from '../../shared/infra/db/sequelize';
import { CUSTOMER_PROVIDERS } from '../customer';
import { DRIVER_PROVIDERS } from '../driver/driver.providers';
import { MAPS_SERVICE_PROVIDER } from '../shared/shared.providers';

const REPOSITORIES = {
  RIDE_REPOSITORY: {
    provide: 'RideRepository',
    useExisting: RideSequelizeRepository,
  },
  RIDE_SEQUELIZE_REPOSITORY: {
    provide: RideSequelizeRepository,
    useFactory: (
      rideModel: typeof RideModel,
      rideEstimationModel: typeof RideEstimationModel,
      uow: UnitOfWorkSequelize,
    ) => new RideSequelizeRepository(rideModel, rideEstimationModel, uow),
    inject: [
      getModelToken(RideModel),
      getModelToken(RideEstimationModel),
      'UnitOfWork',
    ],
  },
};

const USE_CASES = {
  ESTIMATE_RIDE_USECASE: {
    provide: EstimateRideUsecase,
    useFactory: (
      rideRepo: IRideRepository,
      driverRepo: IDriverRepository,
      maps: IMapsService,
    ) => new EstimateRideUsecase(rideRepo, driverRepo, maps),
    inject: [
      REPOSITORIES.RIDE_REPOSITORY.provide,
      DRIVER_PROVIDERS.REPOSITORIES.DRIVER_REPOSITORY.provide,
      MAPS_SERVICE_PROVIDER.provide,
    ],
  },
  CONFIRM_RIDE_USECASE: {
    provide: ConfirmRideUsecase,
    useFactory: (
      uow: IUnitOfWork,
      rideRepo: IRideRepository,
      customerRepo: ICustomerRepository,
      driverRepo: IDriverRepository,
    ) => new ConfirmRideUsecase(uow, rideRepo, customerRepo, driverRepo),
    inject: [
      'UnitOfWork',
      REPOSITORIES.RIDE_REPOSITORY.provide,
      CUSTOMER_PROVIDERS.REPOSITORIES.CUSTOMER_REPOSITORY.provide,
      DRIVER_PROVIDERS.REPOSITORIES.DRIVER_REPOSITORY.provide,
    ],
  },
};

export const RIDE_PROVIDERS = {
  USE_CASES,
  REPOSITORIES,
};
