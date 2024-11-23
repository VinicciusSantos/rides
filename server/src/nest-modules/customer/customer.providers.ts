import { getModelToken } from '@nestjs/sequelize';

import {
  CustomerModel,
  CustomerSequelizeRepository,
} from '../../core/customer/infra/db/sequelize';
import { UnitOfWorkSequelize } from '../../shared/infra/db/sequelize';

export const REPOSITORIES = {
  CUSTOMER_REPOSITORY: {
    provide: 'CustomerRepository',
    useExisting: CustomerSequelizeRepository,
  },
  CUSTOMER_SEQUELIZE_REPOSITORY: {
    provide: CustomerSequelizeRepository,
    useFactory: (
      customerModel: typeof CustomerModel,
      uow: UnitOfWorkSequelize,
    ) => new CustomerSequelizeRepository(customerModel, uow),
    inject: [getModelToken(CustomerModel), 'UnitOfWork'],
  },
};

export const CUSTOMER_PROVIDERS = {
  REPOSITORIES,
};
