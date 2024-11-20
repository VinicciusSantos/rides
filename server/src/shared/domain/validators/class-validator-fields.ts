import { validateSync } from 'class-validator';
import { IValidatorFields } from './validator-fields-interface';
import { Notification } from './notification';

export abstract class ClassValidatorFields implements IValidatorFields {
  public validate(
    notification: Notification,
    data: object,
    fields: string[],
  ): boolean {
    const errors = validateSync(data, { groups: fields });
    if (errors.length) {
      for (const error of errors) {
        Object.values(error.constraints!).forEach((message: string) => {
          notification.addError(message, error.property);
        });
      }
    }
    return !errors.length;
  }
}
