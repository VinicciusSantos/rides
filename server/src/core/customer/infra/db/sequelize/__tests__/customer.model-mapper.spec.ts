import { setupSequelize } from '../../../../../../shared/infra/testing';
import { CustomerFakeBuilder } from '../../../../domain';
import { CustomerModel } from '../customer.model';
import { CustomerModelMapper } from '../customer.model-mapper';

describe('CustomerModelMapper Unit Tests', () => {
  setupSequelize({ models: [CustomerModel] });

  it('should throws error when Customer is invalid', () => {
    const item = CustomerFakeBuilder.one().invalid().build();
    const model = CustomerModel.build(CustomerModelMapper.toModelProps(item));
    expect(() => CustomerModelMapper.toAggregate(model)).toThrow();
  });

  it('should convert Customer to CustomerModel and vice versa', () => {
    const originalEntity = CustomerFakeBuilder.one().build();

    const modelProps = CustomerModelMapper.toModelProps(originalEntity);
    const model = CustomerModel.build(modelProps);

    const entity = CustomerModelMapper.toAggregate(model);
    expect(originalEntity.toJSON()).toEqual(entity.toJSON());
  });
});
