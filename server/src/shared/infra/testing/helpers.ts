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
    await _sequelize.sync({ force: true });
  });

  afterAll(async () => await _sequelize.close());

  return {
    get sequelize() {
      return _sequelize;
    },
  };
}
