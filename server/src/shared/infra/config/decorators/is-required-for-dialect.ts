import { ValidateIf } from 'class-validator';
import { Dialect } from 'sequelize';

export function IsRequiredForDialect(requiredDialects: Dialect[]) {
  return ValidateIf(
    ({ dialect }) => dialect && requiredDialects.includes(dialect),
  );
}
