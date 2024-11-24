import { Global, Module, Scope } from '@nestjs/common';
import { getConnectionToken, SequelizeModule } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';

import { Config } from '../../shared/infra/config';
import { UnitOfWorkSequelize } from '../../shared/infra/db/sequelize';
import { SEQUELIZE_MODELS } from '../../shared/infra/db/sequelize/constants';

@Global()
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: () => ({ ...Config.env.db, models: SEQUELIZE_MODELS }),
    }),
  ],
  providers: [
    {
      provide: UnitOfWorkSequelize,
      useFactory: (sequelize: Sequelize) => new UnitOfWorkSequelize(sequelize),
      inject: [getConnectionToken()],
      scope: Scope.REQUEST,
    },
    {
      provide: 'UnitOfWork',
      useExisting: UnitOfWorkSequelize,
      scope: Scope.REQUEST,
    },
  ],
  exports: ['UnitOfWork'],
})
export class DatabaseModule {}
