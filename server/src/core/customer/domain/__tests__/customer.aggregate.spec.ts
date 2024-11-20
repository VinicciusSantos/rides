import { Customer } from '../customer.aggregate';
import {
  CustomerConstructorProps,
  CustomerCreateCommand,
  CustomerId,
} from '../customer.types';

describe('CustomerAggregate Unit Tests', () => {
  describe('using constructor', () => {
    it('should create', () => {
      const props: CustomerConstructorProps = {
        customer_id: new CustomerId(),
        name: 'John Doe',
      };

      const customer = new Customer(props);

      expect(customer).toBeDefined();
      expect(customer).toBeInstanceOf(Customer);
      expect(customer.toJSON()).toEqual({
        customer_id: expect.any(String),
        name: props.name,
      });
    });
  });

  describe('using create', () => {
    it('should create', () => {
      const props: CustomerCreateCommand = {
        name: 'John Doe',
      };

      const customer = Customer.create(props);

      expect(customer).toBeDefined();
      expect(customer).toBeInstanceOf(Customer);
      expect(customer.toJSON()).toEqual({
        customer_id: expect.any(String),
        name: props.name,
      });
    });
  });

  describe('validations', () => {
    it.each([
      // Customer's ID
      {
        // @ts-expect-error - Intentionally passing invalid value to test validation
        getCustomer: () => Customer.fake.one().withCustomerId(null).build(),
        message: 'Customer ID should be a valid CustomerId',
      },
      // Customer's name
      {
        // @ts-expect-error - Intentionally passing invalid value to test validation
        getCustomer: () => Customer.fake.one().withName(null).build(),
        message: 'Customer name should be a string',
      },
      {
        getCustomer: () => Customer.fake.one().withName('').build(),
        message: 'Customer name must be at least 1 character',
      },
      {
        getCustomer: () =>
          Customer.fake.one().withName('a'.repeat(256)).build(),
        message: 'Customer name must be at most 255 characters',
      },
    ])('should not allow because "$message"', ({ getCustomer, message }) => {
      expect(getCustomer().notification).notificationContainsErrorMessages([
        message,
      ]);
    });
  });
});
