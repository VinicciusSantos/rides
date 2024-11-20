import { DataTypes, Sequelize } from 'sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('t_domain_event', {
    key: {
      type: DataTypes.STRING(128),
      allowNull: false,
      primaryKey: true,
    },
    data: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    event_version: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    occurred_on: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('t_domain_event');
};
