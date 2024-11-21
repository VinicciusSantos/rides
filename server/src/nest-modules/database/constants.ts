import { CustomerModel } from '../../core/customer/infra/db/sequelize';
import { DriverModel } from '../../core/driver/infra/db/sequelize';
import { RideModel } from '../../core/ride/infra/db/sequelize';
import { DomainEventModel } from '../../shared/infra/db/sequelize/models';

export const SEQUELIZE_MODELS = [
  DomainEventModel,
  CustomerModel,
  DriverModel,
  RideModel,
];
