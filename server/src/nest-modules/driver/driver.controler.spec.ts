import { ModuleMetadata } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { GetDriversUsecase } from '../../core/driver/application/usecases';
import { DriverController } from './driver.controller';

const DRIVER_TESTING_MODULE: ModuleMetadata = {
  controllers: [DriverController],
  providers: [{ provide: GetDriversUsecase, useValue: { execute: jest.fn() } }],
};

describe('DriverController', () => {
  let driverController: DriverController;
  let getDriversUsecase: jest.Mocked<GetDriversUsecase>;

  beforeEach(async () => {
    const module = await Test.createTestingModule(
      DRIVER_TESTING_MODULE,
    ).compile();

    driverController = module.get<DriverController>(DriverController);
    getDriversUsecase = module.get(GetDriversUsecase);
  });

  it('should be defined', () => {
    expect(driverController).toBeDefined();
  });

  describe('getDrivers', () => {
    it('should call getDriversUsecase with correct dto', async () => {
      const min_km_lte = 123;
      const driver_id = 456;

      await driverController.getDrivers(min_km_lte, driver_id);

      expect(getDriversUsecase.execute).toHaveBeenCalledWith({
        min_km_lte,
        driver_id,
      });
      expect(getDriversUsecase.execute).toHaveBeenCalledTimes(1);
    });
  });
});
