import { Test, TestingModule } from '@nestjs/testing';

import { RideController } from './ride.controller';
import { ConfirmRideUsecase, EstimateRideUsecase } from '../../core/ride/application/usecases';

const estimateRideUsecaseMock = {
  execute: jest.fn(),
};

const confirmRideUsecaseMock = {
  execute: jest.fn(),
};

describe('RideController', () => {
  let controller: RideController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RideController],
      providers: [
        { provide: EstimateRideUsecase, useValue: estimateRideUsecaseMock },
        { provide: ConfirmRideUsecase, useValue: confirmRideUsecaseMock },
      ],
    }).compile();

    controller = module.get<RideController>(RideController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
