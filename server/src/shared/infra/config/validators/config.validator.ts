import 'reflect-metadata';

import { ValidateNested, validateSync, ValidationError } from 'class-validator';

import { IConfig } from '../../../domain';
import { ConfigValidationError } from '../../../domain/errors';
import { DatabaseRules } from './database.validator';

export class ConfigRules implements IConfig {
  @ValidateNested()
  public db: DatabaseRules;

  constructor(props: IConfig) {
    this.db = new DatabaseRules(props.db);
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
