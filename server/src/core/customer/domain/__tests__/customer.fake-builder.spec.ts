import { Customer } from '../customer.aggregate';
import { CustomerFakeBuilder } from '../customer.fake-builder';
import { CustomerId } from '../customer.types';

describe('CustomerFakeBuilder Unit Tests', () => {
  it('should create a customer', () => {
    const customer = CustomerFakeBuilder.one().build();
    expect(customer).toBeDefined();
    expect(customer).toBeInstanceOf(Customer);
    expect(customer.toJSON()).toEqual({
      customer_id: expect.any(String),
      name: expect.any(String),
    });
  });

  it('should create a lot of customers', () => {
    const count = 5;
    const customers = CustomerFakeBuilder.aLot(count).build();
    expect(customers).toHaveLength(count);
    for (const customer of customers) {
      expect(customer).toBeInstanceOf(Customer);
    }
  });

  it('should create a lot of customers with custom values', () => {
    const count = 5;

    const uuids = Array(count)
      .fill(null)
      .map(() => new CustomerId());

    const customers = CustomerFakeBuilder.aLot(count)
      .withCustomerId((index) => uuids[index])
      .withName((index) => `Customer ${index}`)
      .build();

    expect(customers).toHaveLength(count);
    customers.forEach((customer, index) => {
      expect(customer.toJSON()).toEqual({
        customer_id: uuids[index].id,
        name: `Customer ${index}`,
      });
    });
  });
});
