import { Sequelize } from 'sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().addConstraint('t_ride', {
    fields: ['driver_id'],
    type: 'foreign key',
    name: 'fk_ride_driver',
    references: {
      table: 't_driver',
      field: 'driver_id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize
    .getQueryInterface()
    .removeConstraint('t_ride', 'fk_ride_driver');
};
