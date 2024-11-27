import { Sequelize } from 'sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  const queryInterface = sequelize.getQueryInterface();
  const transaction = await sequelize.transaction();

  try {
    await queryInterface.addConstraint('t_ride', {
      fields: ['driver_id'],
      type: 'foreign key',
      name: 'fk_ride_driver',
      references: {
        table: 't_driver',
        field: 'driver_id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      transaction,
    });

    await queryInterface.addConstraint('t_ride', {
      fields: ['customer_id'],
      type: 'foreign key',
      name: 'fk_ride_customer',
      references: {
        table: 't_customer',
        field: 'customer_id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      transaction,
    });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  const queryInterface = sequelize.getQueryInterface();
  const transaction = await sequelize.transaction();

  try {
    await queryInterface.removeConstraint('t_ride', 'fk_ride_driver', {
      transaction,
    });
    await queryInterface.removeConstraint('t_ride', 'fk_ride_customer', {
      transaction,
    });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
