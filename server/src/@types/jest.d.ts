import { ValueObject } from '../shared/domain/value-object';
import { FieldsErrors } from './shared/domain/validators';

declare global {
  namespace jest {
    interface Matchers<R> {
      notificationContainsErrorMessages: (expected: Array<FieldsErrors>) => R;
      toBeValueObject: (expected: ValueObject) => R;
    }
  }
}
