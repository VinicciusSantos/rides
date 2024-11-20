import { DataTypes, Sequelize } from 'sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('t_driver', {
    driver_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    car: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    rating: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    fee_by_km: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    minimum_km: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  });
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('t_driver');
};
