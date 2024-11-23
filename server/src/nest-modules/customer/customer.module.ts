import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CustomerModel } from '../../core/customer/infra/db/sequelize';
import { CUSTOMER_PROVIDERS } from './customer.providers';

@Module({
  imports: [SequelizeModule.forFeature([CustomerModel])],
  providers: [...Object.values(CUSTOMER_PROVIDERS.REPOSITORIES)],
  exports: [CUSTOMER_PROVIDERS.REPOSITORIES.CUSTOMER_REPOSITORY.provide],
})
export class CustomerModule {}
