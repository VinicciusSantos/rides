import { isArray, isEmpty, isNaN, isNull, isObject, isUndefined } from 'lodash';

/**
 * clearObject is a function that removes all null, undefined, NaN, empty string and empty array values from an object.
 * @param value - The object to be cleaned.
 * @returns The object cleaned.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function clearObject<T = any>(value: any): T {
  Object.keys(value).map((key) => {
    if (value[key] && !isArray(value[key]) && isObject(value[key])) {
      clearObject(value[key]);
    } else if (
      isNull(value[key]) ||
      isUndefined(value[key]) ||
      isNaN(value[key]) ||
      value[key] === '' ||
      (isArray(value[key]) && isEmpty(value[key]))
    ) {
      delete value[key];
    }
  });
  return value;
}
