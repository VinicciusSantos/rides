import {
  HttpRequestFailedError,
  InvalidDataError,
} from '../../../../../shared/domain/errors';
import {
  HTTPStatus,
  IMapsService,
} from '../../../../../shared/domain/services';
import { Driver, DriverId, IDriverRepository } from '../../../../driver/domain';
import { Review, Vehicle } from '../../../../driver/domain/value-objects';
import { IRideRepository, RideEstimation } from '../../../domain';
import { EstimateRideUsecase } from './estimate-ride.usecase';

const rideRepoMock = {
  registerEstimation: jest.fn(),
};

const driverRepoMock = {
  findAll: jest.fn(),
};

const mapsServiceMock = {
  getCoordinates: jest.fn(),
  computeRoutesByCar: jest.fn(),
};

describe('EstimateRideUsecase', () => {
  let usecase: EstimateRideUsecase;

  beforeEach(() => {
    usecase = new EstimateRideUsecase(
      rideRepoMock as unknown as IRideRepository,
      driverRepoMock as unknown as IDriverRepository,
      mapsServiceMock as unknown as IMapsService,
    );
  });

  it('should throw an error if origin and destination are the same string', async () => {
    await expect(
      usecase.execute({
        customer_id: '123',
        origin: 'same-place',
        destination: 'same-place',
      }),
    ).rejects.toThrow('Origin and destination must be different');
  });

  it('should throw an error if origin and destination coordinates are the same', async () => {
    const mockCoords = { equals: jest.fn(() => true) };
    mapsServiceMock.getCoordinates.mockResolvedValueOnce(mockCoords);
    mapsServiceMock.getCoordinates.mockResolvedValueOnce(mockCoords);

    await expect(
      usecase.execute({
        customer_id: '123',
        origin: 'A',
        destination: 'B',
      }),
    ).rejects.toThrow('Origin and destination must be different');

    expect(mapsServiceMock.getCoordinates).toHaveBeenCalledTimes(2);
  });

  it('should return a ride estimation successfully', async () => {
    const originMock = {
      toJSON: jest.fn(() => ({ lat: 1, lng: 2 })),
      equals: jest.fn(() => false),
    };

    const destinationMock = {
      toJSON: jest.fn(() => ({ lat: 3, lng: 4 })),
      equals: jest.fn(() => false),
    };

    const computedRouteMock = {
      distanceMeters: 10000,
      duration: '15 mins',
      polyline: { encodedPolyline: 'encoded-polyline' },
    };

    const driver = new Driver({
      driver_id: new DriverId(1),
      name: 'John',
      description: 'Experienced driver',
      vehicle: new Vehicle({
        brand: 'Car A',
        model: 'Model A',
        year: 2020,
        description: 'vehicle description',
      }),
      minimum_km: 5,
      review: new Review({
        rating: 4,
        comment: 'TODO: Implement review system',
      }),
      fee_by_km: 5,
    });

    mapsServiceMock.getCoordinates.mockResolvedValueOnce(originMock);
    mapsServiceMock.getCoordinates.mockResolvedValueOnce(destinationMock);
    mapsServiceMock.computeRoutesByCar.mockResolvedValue(computedRouteMock);
    driverRepoMock.findAll.mockResolvedValue({ items: [driver] });

    const result = await usecase.execute({
      customer_id: '123',
      origin: 'A',
      destination: 'B',
    });

    const distance = computedRouteMock.distanceMeters;

    expect(result).toEqual({
      origin: { lat: 1, lng: 2 },
      destination: { lat: 3, lng: 4 },
      distance,
      duration: computedRouteMock.duration,
      options: [
        {
          id: driver.driver_id.id,
          name: driver.name,
          description: driver.description,
          vehicle: driver.vehicle.toJSON().formatted_name,
          review: driver.review.toJSON(),
          value: driver.fee_by_km * (distance / 1000),
        },
      ],
      routeResponse: computedRouteMock,
    });

    expect(rideRepoMock.registerEstimation).toHaveBeenCalledWith(
      expect.any(RideEstimation),
    );
  });

  describe('getOriginAndDestination Error Handling', () => {
    it('should throw InvalidDataError if requestFailedByInvalidData returns true', async () => {
      const mockError = new HttpRequestFailedError(
        'Invalid request',
        HTTPStatus.BAD_REQUEST,
      );

      mapsServiceMock.getCoordinates.mockRejectedValueOnce(mockError);

      await expect(
        usecase['getOriginAndDestination']({
          customer_id: '123',
          origin: 'invalid-origin',
          destination: 'valid-destination',
        }),
      ).rejects.toThrowError(InvalidDataError);
    });

    it('should rethrow the original error if requestFailedByInvalidData returns false', async () => {
      const mockError = new Error('Unexpected error');

      mapsServiceMock.getCoordinates.mockRejectedValueOnce(mockError);

      await expect(
        usecase['getOriginAndDestination']({
          customer_id: '123',
          origin: 'invalid-origin',
          destination: 'valid-destination',
        }),
      ).rejects.toThrowError(mockError);
    });
  });
});
