import {
  HttpRequestFailedError,
  InvalidDataError,
} from '../../../../../shared/domain/errors';
import {
  HTTPStatus,
  IMapsService,
} from '../../../../../shared/domain/services';
import { IDriverRepository } from '../../../../driver/domain';
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

    const driversResMock = {
      items: [
        {
          toJSON: jest.fn(() => ({
            driver_id: 1,
            name: 'John',
            description: 'Experienced driver',
            vehicle: { formatted_name: 'Car A' },
            rating: 4.5,
            fee_by_km: 5,
          })),
        },
      ],
    };

    mapsServiceMock.getCoordinates.mockResolvedValueOnce(originMock);
    mapsServiceMock.getCoordinates.mockResolvedValueOnce(destinationMock);
    mapsServiceMock.computeRoutesByCar.mockResolvedValue(computedRouteMock);
    driverRepoMock.findAll.mockResolvedValue(driversResMock);

    const result = await usecase.execute({
      customer_id: '123',
      origin: 'A',
      destination: 'B',
    });

    expect(result).toEqual({
      origin: { lat: 1, lng: 2 },
      destination: { lat: 3, lng: 4 },
      distance: 10000,
      duration: '15 mins',
      options: [
        {
          id: 1,
          name: 'John',
          description: 'Experienced driver',
          vehicle: 'Car A',
          review: {
            rating: 4.5,
            comment: 'TODO: Implement review system',
          },
          value: 50,
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
