import { ZodObject } from 'zod';

import { Notification } from './notification';

export abstract class ClassValidatorFields {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected abstract schema: ZodObject<any>;

  public validate(data: { notification: Notification }): boolean {
    const result = this.schema.safeParse(data);
    if (!result.success) {
      for (const error of result.error.errors) {
        data.notification.addError(error.message);
      }
    }
    return result.success;
  }
}
