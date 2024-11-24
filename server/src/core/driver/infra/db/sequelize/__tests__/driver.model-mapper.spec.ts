import { setupSequelize } from '../../../../../../shared/infra/testing';
import { DriverFakeBuilder } from '../../../../domain';
import { DriverModel } from '../driver.model';
import { DriverModelMapper } from '../driver.model-mapper';

describe('DriverModelMapper Unit Tests', () => {
  setupSequelize({ models: [DriverModel] });

  it('should throws error when Driver is invalid', () => {
    const item = DriverFakeBuilder.one().invalid().build();
    const model = DriverModel.build(DriverModelMapper.toModelProps(item));
    expect(() => DriverModelMapper.toEntity(model)).toThrow();
  });

  it('should convert Driver to DriverModel and vice versa', () => {
    const originalEntity = DriverFakeBuilder.one().build();

    const modelProps = DriverModelMapper.toModelProps(originalEntity);
    const model = DriverModel.build(modelProps);

    const entity = DriverModelMapper.toEntity(model);
    expect(originalEntity.toJSON()).toEqual(entity.toJSON());
  });
});
