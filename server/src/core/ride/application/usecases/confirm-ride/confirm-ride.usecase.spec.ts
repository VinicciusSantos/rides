import { Chance } from 'chance';

import { IUnitOfWork } from '../../../../../shared/domain/repository';
import { Geolocation } from '../../../../../shared/domain/value-objects';
import { Driver, IDriverRepository } from '../../../../driver/domain';
import { IRideRepository, Ride, RideEstimation } from '../../../domain';
import { ConfirmRideUsecase } from './confirm-ride.usecase';
import { CustomerId } from '../../../../customer/domain';

const chance = Chance();

const generateRandomLocation = (): Geolocation =>
  new Geolocation(chance.latitude(), chance.longitude(), chance.address());

const uowMock = {
  do: jest.fn((callback: () => Promise<void>) => callback()),
};

const rideRepoMock = {
  findEstimation: jest.fn(),
  removeEstimation: jest.fn(),
  insert: jest.fn(),
};

const driverRepoMock = {
  findOne: jest.fn(),
};

describe('ConfirmRideUsecase', () => {
  let usecase: ConfirmRideUsecase;

  beforeEach(() => {
    usecase = new ConfirmRideUsecase(
      uowMock as unknown as IUnitOfWork,
      rideRepoMock as unknown as IRideRepository,
      driverRepoMock as unknown as IDriverRepository,
    );

    jest.clearAllMocks();
  });

  it('should throw an error if driver is not found', async () => {
    driverRepoMock.findOne.mockResolvedValueOnce(null);

    await expect(
      usecase.execute({
        customer_id: '123',
        origin: 'Origin',
        destination: 'Destination',
        distance: 1000,
        duration: '10 mins',
        driver: { id: 1, name: 'Driver' },
        value: 50,
      }),
    ).rejects.toThrow('Driver with ID 1 not found');
  });

  it('should throw an error if ride estimation is not found', async () => {
    driverRepoMock.findOne.mockResolvedValueOnce({ driver_id: 1 });
    rideRepoMock.findEstimation.mockResolvedValueOnce(null);

    await expect(
      usecase.execute({
        customer_id: '123',
        origin: 'Origin',
        destination: 'Destination',
        distance: 1000,
        duration: '10 mins',
        driver: { id: 1, name: 'Driver' },
        value: 50,
      }),
    ).rejects.toThrow(
      'This ride was not estimated. Are you trying to cheat the system? 0_o',
    );
  });

  it('should throw an error if the ride information is different from the estimation', async () => {
    const estimatedRide = new RideEstimation({
      id: 1,
      origin: generateRandomLocation(),
      destination: generateRandomLocation(),
      distance: 1000,
      duration: '10 mins',
      encoded_polyline: 'encoded-polyline',
    });

    driverRepoMock.findOne.mockResolvedValueOnce({
      driver_id: 1,
      fee_by_km: 5,
    });
    rideRepoMock.findEstimation.mockResolvedValueOnce(estimatedRide);

    await expect(
      usecase.execute({
        customer_id: '123',
        origin: 'Invalid Origin',
        destination: 'Destination',
        distance: 2000,
        duration: '20 mins',
        driver: { id: 1, name: 'Driver' },
        value: 50,
      }),
    ).rejects.toThrow();
  });

  it('should confirm the ride successfully', async () => {
    const distance = 1000;

    const estimatedRide = new RideEstimation({
      id: 1,
      origin: generateRandomLocation(),
      destination: generateRandomLocation(),
      duration: '10 mins',
      encoded_polyline: 'encoded-polyline',
      distance,
    });

    const driver = Driver.fake.one().build();

    driverRepoMock.findOne.mockResolvedValueOnce(driver);
    rideRepoMock.findEstimation.mockResolvedValueOnce(estimatedRide);

    await usecase.execute({
      customer_id: new CustomerId().toString(),
      origin: estimatedRide.origin.address!,
      destination: estimatedRide.destination.address!,
      duration: estimatedRide.duration,
      driver: { id: driver.driver_id.id, name: driver.name },
      value: distance * (driver.fee_by_km / 1000),
      distance,
    });

    expect(uowMock.do).toHaveBeenCalledTimes(1);
    expect(rideRepoMock.removeEstimation).toHaveBeenCalledWith(
      estimatedRide.id,
    );
    expect(rideRepoMock.insert).toHaveBeenCalledWith(expect.any(Ride));
  });
});
