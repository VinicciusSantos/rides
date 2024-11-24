import { setupSequelize } from '../../../../../../shared/infra/testing';
import { RideFakeBuilder } from '../../../../domain';
import { RideModel } from '../ride.model';
import { RideModelMapper } from '../ride.model-mapper';

describe('RideModelMapper Unit Tests', () => {
  setupSequelize({ models: [RideModel] });

  it('should throws error when Ride is invalid', () => {
    const ride = RideFakeBuilder.one().invalid().build();
    const model = RideModel.build(RideModelMapper.toModelProps(ride));
    expect(() => RideModelMapper.toEntity(model)).toThrow();
  });

  it('should convert Ride to RideModel and vice versa', () => {
    const originalEntity = RideFakeBuilder.one().build();

    const modelProps = RideModelMapper.toModelProps(originalEntity);
    const model = RideModel.build(modelProps);

    const entity = RideModelMapper.toEntity(model);
    expect(originalEntity.toJSON()).toEqual(entity.toJSON());
  });
});
