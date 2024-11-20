import { Dialect } from 'sequelize/types';

export interface IConfig {
  db: IDatabase;
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
