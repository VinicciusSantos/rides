import { clearObject } from './clear-object';

const mock = {
  nullKey: null,
  undefinedKey: undefined,
  emptyStringKey: '',
  nanKey: NaN,
};

describe('Clear object', () => {
  it('should return an empty object when keys have empty values', () => {
    expect(clearObject(mock)).toEqual({});
  });

  it('should return an empty object when a key in inside other object', () => {
    const result = clearObject({
      ...mock,
      nullKeyInsideObject: { key: null },
    });
    expect(result).toEqual({ nullKeyInsideObject: {} });
  });

  it('should return same object when a key have a non-empty value', () => {
    const validValue = {
      DB_DATABASE: 'shopperDB',
      DB_USERNAME: 'root',
      DB_PASSWORD: 'root',
      DB_DIALECT: 'mysql',
      DB_HOST: 'localhost',
      DB_LOGGING: false,
      DB_PORT: 3306,
    };
    expect(clearObject({ ...mock, ...validValue })).toEqual(validValue);
  });
});
