import { DataTypes, Sequelize } from 'sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  const queryInterface = sequelize.getQueryInterface();

  const transaction = await sequelize.transaction();
  try {
    await queryInterface.removeColumn('t_driver', 'rating', { transaction });

    await queryInterface.addColumn(
      't_driver',
      'review',
      { type: DataTypes.JSON, allowNull: false },
      { transaction },
    );

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
    await queryInterface.addColumn(
      't_driver',
      'rating',
      { type: DataTypes.FLOAT, allowNull: true },
      { transaction },
    );

    await sequelize.query(
      `
      UPDATE t_driver
      SET rating = (review->>'rating')::FLOAT
      WHERE review IS NOT NULL
    `,
      { transaction },
    );

    await queryInterface.changeColumn(
      't_driver',
      'rating',
      { type: DataTypes.FLOAT, allowNull: false },
      { transaction },
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
