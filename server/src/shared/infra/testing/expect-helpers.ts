import { isString } from 'lodash';

import { Notification } from '../../domain/validators';
import { ValueObject } from '../../domain/value-objects';
import { Config } from '../config';

Config.readEnv();

/***
 * toBeValueObject is a custom Jest matcher that checks if two value objects are equal.
 * @param expected - The expected value object.
 * @param received - The received value object.
 * @returns {pass: boolean, message: () => string} - The result of the comparison.
 */
const toBeValueObject = (expected: ValueObject, received: ValueObject) => {
  return expected.equals(received)
    ? { pass: true, message: () => '' }
    : {
        pass: false,
        message: () =>
          `The values object are not equal. Expected: ${JSON.stringify(
            expected,
          )} | Received: ${JSON.stringify(received)}`,
      };
};

/***
 * notificationContainsErrorMessages is a custom Jest matcher that checks if a notification contains the expected errors.
 * @param expected - The expected notification.
 * @param received - The received errors.
 * @returns {pass: boolean, message: () => string} - The result of the comparison.
 */
const notificationContainsErrorMessages = (
  expected: Notification,
  received: Array<string | { [key: string]: string[] }>,
) => {
  const every = received.every((error) => {
    if (isString(error)) {
      return expected.errors.has(error);
    } else {
      return Object.entries(error).every(([field, messages]) => {
        const fieldMessages = expected.errors.get(field) as string[];

        return (
          fieldMessages &&
          fieldMessages.length &&
          fieldMessages.every((message) => messages.includes(message))
        );
      });
    }
  });

  return every
    ? { pass: true, message: () => '' }
    : {
        pass: false,
        message: () =>
          `The validation errors not contains ${JSON.stringify(
            received,
          )}. Current: ${JSON.stringify(expected.toJSON())}`,
      };
};

expect.extend({
  notificationContainsErrorMessages,
  toBeValueObject,
});
