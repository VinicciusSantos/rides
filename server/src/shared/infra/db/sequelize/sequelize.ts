import { Sequelize } from 'sequelize-typescript';

import { IDatabase } from '../../../domain';
import { Config } from '../../config';
import { SEQUELIZE_MODELS } from './constants';

export class SequelizeDb {
  private static instance: Sequelize;

  static get sequelize() {
    if (!this.instance) {
      const { database, username, password, host, dialect, port, logging } =
        Config.env.db as Required<IDatabase>;

      this.instance = new Sequelize(database, username, password, {
        host,
        dialect,
        port,
        logging,
        models: SEQUELIZE_MODELS,
      });
    }

    return this.instance;
  }
}
