import { MigrationFn } from 'umzug';
import { Sequelize } from 'sequelize';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize
    .getQueryInterface()
    .renameColumn('t_driver', 'car', 'vehicle');
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize
    .getQueryInterface()
    .renameColumn('t_driver', 'vehicle', 'car');
};
