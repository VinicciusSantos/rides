import { ModuleMetadata } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import {
  ConfirmRideUsecase,
  EstimateRideUsecase,
  EstimateRideUsecaseOutput,
  GetRidesUsecase,
} from '../../core/ride/application/usecases';
import { RideController } from './ride.controller';
import { ConfirmRideDto, EstimateRideDto } from './dtos';
import Chance from 'chance';
import { Geolocation } from '../../shared/domain/value-objects';

const chance = Chance();

const generateRandomLocation = (): Geolocation =>
  new Geolocation(chance.latitude(), chance.longitude(), chance.address());

const RIDE_TESTING_MODULE: ModuleMetadata = {
  controllers: [RideController],
  providers: [
    { provide: EstimateRideUsecase, useValue: { execute: jest.fn() } },
    { provide: ConfirmRideUsecase, useValue: { execute: jest.fn() } },
    { provide: GetRidesUsecase, useValue: { execute: jest.fn() } },
  ],
};

describe('RideController', () => {
  let rideController: RideController;
  let estimateRideUsecase: jest.Mocked<EstimateRideUsecase>;
  let confirmRideUsecase: jest.Mocked<ConfirmRideUsecase>;
  let getRidesUsecase: jest.Mocked<GetRidesUsecase>;

  beforeEach(async () => {
    const module =
      await Test.createTestingModule(RIDE_TESTING_MODULE).compile();

    rideController = module.get<RideController>(RideController);
    estimateRideUsecase = module.get(EstimateRideUsecase);
    confirmRideUsecase = module.get(ConfirmRideUsecase);
    getRidesUsecase = module.get(GetRidesUsecase);
  });

  it('should be defined', () => {
    expect(rideController).toBeDefined();
  });

  describe('estimateRide', () => {
    it('should call estimateRideUsecase with correct dto', async () => {
      const estimateDto: EstimateRideDto = {
        origin: chance.address(),
        destination: chance.address(),
      };

      const expectedResponse: EstimateRideUsecaseOutput = {
        distance: 10,
        duration: '15s',
        origin: generateRandomLocation().toJSON(),
        destination: generateRandomLocation().toJSON(),
        options: [],
        routeResponse: undefined,
      };
      estimateRideUsecase.execute.mockResolvedValue(expectedResponse);

      const response = await rideController.estimateRide(estimateDto);

      expect(estimateRideUsecase.execute).toHaveBeenCalledWith({
        customer_id: '1',
        origin: estimateDto.origin,
        destination: estimateDto.destination,
      });
      expect(estimateRideUsecase.execute).toHaveBeenCalledTimes(1);
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('confirmRide', () => {
    it('should call confirmRideUsecase with correct dto', async () => {
      const confirmDto: ConfirmRideDto = {
        customer_id: '1',
        origin: chance.address(),
        destination: chance.address(),
        distance: 10,
        duration: '15s',
        value: 50,
        driver: { id: 1, name: 'John Doe' },
      };

      await rideController.confirmRide(confirmDto);

      expect(confirmRideUsecase.execute).toHaveBeenCalledWith({
        customer_id: confirmDto.customer_id,
        origin: confirmDto.origin,
        destination: confirmDto.destination,
        distance: confirmDto.distance,
        duration: confirmDto.duration,
        driver: confirmDto.driver,
        value: confirmDto.value,
      });
      expect(confirmRideUsecase.execute).toHaveBeenCalledTimes(1);
    });
  });

  describe('getRides', () => {
    it('should call getRidesUsecase with correct dto', async () => {
      const customer_id = '1';

      await rideController.getRides(customer_id);

      expect(getRidesUsecase.execute).toHaveBeenCalledWith(
        expect.objectContaining({ customer_id }),
      );
      expect(getRidesUsecase.execute).toHaveBeenCalledTimes(1);
    });
  });
});
