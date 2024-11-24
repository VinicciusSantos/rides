import {
  ErrorType,
  InvalidDataError,
} from '../../../../../shared/domain/errors';
import { Customer, CustomerId } from '../../../domain';
import { CustomerModel, CustomerModelProps } from './customer.model';

export class CustomerModelMapper {
  public static toAggregate(model: CustomerModel): Customer {
    const rawData = model.toJSON();
    const customer = new Customer({
      ...rawData,
      customer_id: new CustomerId(rawData.customer_id),
    });

    customer.validate();

    if (customer.notification.hasErrors()) {
      throw new InvalidDataError(
        ErrorType.ENTITY_VALIDATION,
        customer.notification.toString(),
      );
    }

    return customer;
  }

  public static toModelProps(aggregate: Customer): CustomerModelProps {
    const customerInfos = aggregate.toJSON();
    return {
      customer_id: customerInfos.customer_id,
      name: customerInfos.name,
    };
  }
}
