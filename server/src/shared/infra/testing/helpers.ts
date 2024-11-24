import { ModelCtor, Sequelize, SequelizeOptions } from 'sequelize-typescript';

import { Config } from '../config';
import { DomainEventModel } from '../db/sequelize/models';

export function setupSequelize(options: SequelizeOptions = {}) {
  let _sequelize: Sequelize;

  (options.models as ModelCtor[]).push(DomainEventModel);

  beforeAll(async () => {
    _sequelize = new Sequelize({
      ...Config.env.db,
      ...options,
    });
  });

  beforeEach(async () => {
    try {
      await _sequelize.sync({ force: true });
    } catch (error) {
      // Disable foreign key checks to truncate tables
      await _sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
      await _sequelize.sync({ force: true });
      await _sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    }
  });

  afterAll(async () => await _sequelize.close());

  return {
    get sequelize() {
      return _sequelize;
    },
  };
}
