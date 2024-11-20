import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Dialect } from 'sequelize';

import { IDatabase } from '../../../domain';
import { IsRequiredForDialect } from '../decorators';

export class DatabaseRules implements IDatabase {
  @IsString()
  @IsIn(['mysql', 'sqlite', 'postgres'])
  public dialect: Dialect;

  @IsString()
  public host: string;

  @IsNumber()
  @IsRequiredForDialect(['mysql', 'postgres'])
  public port?: number;

  @IsString()
  @IsRequiredForDialect(['mysql', 'postgres'])
  public username?: string;

  @IsRequiredForDialect(['mysql', 'postgres'])
  @IsString()
  public password?: string;

  @IsRequiredForDialect(['mysql', 'postgres'])
  @IsString()
  public database?: string;

  @IsOptional()
  @IsBoolean()
  public logging?: boolean;

  constructor(props: IDatabase) {
    this.dialect = props.dialect;
    this.host = props.host;
    this.port = props.port;
    this.username = props.username;
    this.password = props.password;
    this.database = props.database;
    this.logging = props.logging;
  }
}
