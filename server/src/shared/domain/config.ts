import { Dialect } from 'sequelize/types';

export interface IConfig {
  db: IDatabase;
  google_api_key: string;
  keycloak: IKeycloak;
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

export interface IKeycloak {
  api_url: string;
  realm: string;
  admin_username: string;
  admin_password: string;
}
