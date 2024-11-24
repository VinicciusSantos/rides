import { Geolocation } from '../../../../../../shared/domain/value-objects';
import { setupSequelize } from '../../../../../../shared/infra/testing';
import { RideEstimation } from '../../../../domain';
import { RideEstimationModel } from '../ride.model';
import { RideEstimationModelMapper } from '../ride.model-mapper';

describe('RideEstimationModelMapper Unit Tests', () => {
  setupSequelize({ models: [RideEstimationModel] });

  it('should convert RideEstimation to RideEstimationModel and vice versa', () => {
    const originalVO = new RideEstimation({
      id: 123,
      origin: new Geolocation(1, 0),
      destination: new Geolocation(0, 1),
      distance: 123456,
      duration: '10s',
      encoded_polyline: 'encoded_polyline',
      created_at: new Date(),
    });

    const modelProps = RideEstimationModelMapper.toModelProps(originalVO);
    const model = RideEstimationModel.build({ ...modelProps });

    const newVO = RideEstimationModelMapper.toValueObject(model);
    expect(originalVO.toJSON()).toEqual(newVO.toJSON());
  });
});
