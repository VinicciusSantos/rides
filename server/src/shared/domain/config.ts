import { Dialect } from 'sequelize/types';

export interface IConfig {
  db: IDatabase;
  google_api_key: string;
}

export interface IDatabase {
  dialect: Dialect;
  host: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  logging?: boolean;
}
