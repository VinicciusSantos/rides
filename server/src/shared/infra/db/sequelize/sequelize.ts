import { Sequelize } from 'sequelize';
import { Config } from '../../config';
import { IDatabase } from '../../../domain';

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
      });
    }

    return this.instance;
  }
}
