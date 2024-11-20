import 'dotenv/config';

import { IConfig } from '../../domain/config';
import { clearObject } from '../utils';
import { ConfigValidator } from './validators/config.validator';

export class Config {
  private static _env?: IConfig;

  public static get env(): IConfig {
    if (!Config._env) {
      Config.readEnv();
    }

    return Config._env!;
  }

  public static readEnv() {
    if (Config._env) {
      return;
    }

    Config._env = clearObject<IConfig>({
      db: {
        database: process.env.DB_DATABASE,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        dialect: process.env.DB_DIALECT,
        host: process.env.DB_HOST,
        logging: process.env.DB_LOGGING === 'true',
        port: Number(process.env.DB_PORT),
      },
    });

    ConfigValidator.validate(Config._env);
  }
}
