import { IDriverRepository } from '../../core/driver/domain';
import { EstimateRideUsecase } from '../../core/ride/application/usecases';
import { IUnitOfWork } from '../../shared/domain/repository';
import { IMapsService } from '../../shared/domain/services';
import { DRIVER_PROVIDERS } from '../driver/driver.providers';
import { MAPS_SERVICE_PROVIDER } from '../shared/shared.providers';

const USE_CASES = {
  LOGIN_WITH_CREDENTIALS_USE_CASE: {
    provide: EstimateRideUsecase,
    useFactory: (
      uow: IUnitOfWork,
      maps: IMapsService,
      driverRepo: IDriverRepository,
    ) => new EstimateRideUsecase(uow, maps, driverRepo),
    inject: [
      'UnitOfWork',
      MAPS_SERVICE_PROVIDER.provide,
      DRIVER_PROVIDERS.REPOSITORIES.DRIVER_REPOSITORY.provide,
    ],
  },
};

export const RIDE_PROVIDERS = {
  USE_CASES,
};
