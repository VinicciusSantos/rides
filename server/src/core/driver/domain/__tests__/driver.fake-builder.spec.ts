import { Vehicle } from '../vehicle.vo';
import { Driver } from '../driver.aggregate';
import { DriverFakeBuilder } from '../driver.fake-builder';
import { DriverId } from '../driver.types';

describe('DriverFakeBuilder Unit Tests', () => {
  it('should create one driver', () => {
    const driver = DriverFakeBuilder.one().build();
    expect(driver).toBeDefined();
    expect(driver).toBeInstanceOf(Driver);
    expect(driver.toJSON()).toEqual({
      driver_id: expect.any(Number),
      name: expect.any(String),
      description: expect.any(String),
      car: {
        brand: expect.any(String),
        model: expect.any(String),
        year: expect.any(Number),
        description: expect.any(String),
        observations: expect.any(String),
        formatted_name: expect.any(String),
      },
      rating: expect.any(Number),
      fee_by_km: expect.any(Number),
      minimum_km: expect.any(Number),
    });
  });

  it('should create a lot of drivers', () => {
    const count = 5;
    const drivers = DriverFakeBuilder.aLot(count).build();
    expect(drivers).toHaveLength(count);
    for (const driver of drivers) {
      expect(driver).toBeInstanceOf(Driver);
    }
  });

  it('should create a lot of drivers with custom values', () => {
    const count = 5;

    const drivers = DriverFakeBuilder.aLot(count)
      .withDriverId((index) => new DriverId(index))
      .withName((index) => `Driver ${index}`)
      .withDescription((index) => `Description ${index}`)
      .withCar(
        (index) =>
          new Vehicle({
            brand: `Brand ${index}`,
            model: `Model ${index}`,
            year: 2000 + index,
            description: `Description ${index}`,
          }),
      )
      .withRating((index) => index)
      .withFeeByKm((index) => index)
      .withMinimumKm((index) => index)
      .build();

    expect(drivers).toHaveLength(count);

    drivers.forEach((driver, index) => {
      expect(driver.toJSON()).toEqual({
        driver_id: index,
        name: `Driver ${index}`,
        description: `Description ${index}`,
        car: {
          brand: `Brand ${index}`,
          model: `Model ${index}`,
          year: 2000 + index,
          description: `Description ${index}`,
          observations: '',
          formatted_name: expect.any(String),
        },
        rating: index,
        fee_by_km: index,
        minimum_km: index,
      });
    });
  });
});
