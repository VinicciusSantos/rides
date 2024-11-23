import { CustomerModel } from '../../../../core/customer/infra/db/sequelize';
import { DriverModel } from '../../../../core/driver/infra/db/sequelize';
import {
  RideEstimationModel,
  RideModel,
} from '../../../../core/ride/infra/db/sequelize';
import { DomainEventModel } from './models';

export const SEQUELIZE_MODELS = [
  DomainEventModel,
  CustomerModel,
  DriverModel,
  RideEstimationModel,
  RideModel,
];
