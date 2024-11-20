import { AggregateRoot } from '../../../shared/domain';
import { CustomerFakeBuilder } from './customer.fake-builder';
import {
  CustomerConstructorProps,
  CustomerCreateCommand,
  CustomerId,
  CustomerJSON,
} from './customer.types';
import { CustomerValidator } from './customer.validator';

export class Customer
  extends AggregateRoot<CustomerJSON, CustomerId>
  implements CustomerConstructorProps
{
  private readonly _customer_id: CustomerId;
  private _name: string;

  public get entity_id(): CustomerId {
    return this._customer_id;
  }

  public get customer_id(): CustomerId {
    return this._customer_id;
  }

  public get name(): string {
    return this._name;
  }

  public static get fake() {
    return CustomerFakeBuilder;
  }

  public static create(props: CustomerCreateCommand): Customer {
    const customer = new Customer({
      ...props,
      customer_id: new CustomerId(),
    });

    customer.validate();
    return customer;
  }

  constructor(props: CustomerConstructorProps) {
    super();
    this._customer_id = props.customer_id;
    this._name = props.name;
  }

  public validate(): boolean {
    return new CustomerValidator().validate(this);
  }

  public toJSON(): CustomerJSON {
    return {
      customer_id: this.customer_id.id,
      name: this.name,
    };
  }
}
