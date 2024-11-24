import {
  FakeBuilder,
  OptionalFakeFields,
  PropOrFactory,
} from '../../../shared/infra/testing';
import { Customer } from './customer.aggregate';
import { CustomerId, CustomerJSON } from './customer.types';

export class CustomerFakeBuilder<T, TJSON> extends FakeBuilder<
  Customer,
  CustomerJSON,
  T,
  TJSON
> {
  private _customer_id?: PropOrFactory<CustomerId> = () => new CustomerId();
  private _name?: PropOrFactory<string> = () => this.chance.name();

  protected optionalFields: OptionalFakeFields<CustomerJSON> = [];

  public static one() {
    return new CustomerFakeBuilder<Customer, CustomerJSON>();
  }

  public static aLot(countObjs: number) {
    return new CustomerFakeBuilder<Customer[], CustomerJSON[]>(countObjs);
  }

  private constructor(protected countObjs: number = 1) {
    super();
  }

  public withCustomerId(valueOrFactory: PropOrFactory<CustomerId>): this {
    this._customer_id = valueOrFactory;
    return this;
  }

  public withName(valueOrFactory: PropOrFactory<string>): this {
    this._name = valueOrFactory;
    return this;
  }

  public invalid(): this {
    this._name = () => '';
    return this;
  }

  protected buildOne(index: number): Customer {
    const customer = new Customer({
      customer_id: this.callFactory(this._customer_id, index) as CustomerId,
      name: this.callFactory(this._name, index) as string,
    });

    customer.validate();
    return customer;
  }
}
