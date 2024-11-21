import 'reflect-metadata';

import {
  IsString,
  ValidateNested,
  validateSync,
  ValidationError,
} from 'class-validator';

import { IConfig } from '../../../domain';
import { ConfigValidationError } from '../../../domain/errors';
import { DatabaseRules } from './database.validator';

export class ConfigRules implements IConfig {
  @ValidateNested()
  public db: DatabaseRules;

  @IsString()
  public google_api_key: string;

  constructor(props: IConfig) {
    this.db = new DatabaseRules(props.db);
    this.google_api_key = props.google_api_key;
  }
}

export class ConfigValidator {
  public static validate(config: IConfig): void {
    const errors: ValidationError[] = validateSync(new ConfigRules(config));
    if (errors.length) {
      throw new ConfigValidationError(errors);
    }
  }
}
