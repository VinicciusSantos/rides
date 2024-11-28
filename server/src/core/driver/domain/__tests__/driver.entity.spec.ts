import { Review, Vehicle } from '../value-objects';
import { Driver } from '../driver.aggregate';
import {
  DriverConstructorProps,
  DriverCreateCommand,
  DriverId,
} from '../driver.types';

describe('DriverAggregate Unit Tests', () => {
  describe('using constructor', () => {
    it('should create', () => {
      const props: DriverConstructorProps = {
        driver_id: new DriverId(),
        name: 'Homer Simpson',
        description:
          'Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).',
        vehicle: new Vehicle({
          brand: 'Plymouth',
          model: 'Valiant',
          year: 1973,
          description: 'rosa e enferrujado',
        }),
        review: new Review({
          rating: 5,
          comment: 'O melhor motorista de todos!',
        }),
        fee_by_km: 2.5,
        minimum_km: 1,
      };

      const driver = new Driver(props);

      expect(driver).toBeDefined();
      expect(driver).toBeInstanceOf(Driver);
      expect(driver.toJSON()).toEqual({
        driver_id: expect.any(Number),
        name: driver.name,
        description: driver.description,
        vehicle: driver.vehicle.toJSON(),
        review: driver.review.toJSON(),
        fee_by_km: driver.fee_by_km,
        minimum_km: driver.minimum_km,
      });
    });
  });

  describe('using create', () => {
    it('should create', () => {
      const props: DriverCreateCommand = {
        name: 'Homer Simpson',
        description:
          'Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).',
        vehicle: new Vehicle({
          brand: 'Plymouth',
          model: 'Valiant',
          year: 1973,
          description: 'rosa e enferrujado',
        }),
        review: new Review({
          rating: 2,
          comment: 'Mais ou menos...',
        }),
        fee_by_km: 2.5,
        minimum_km: 1,
      };

      const driver = Driver.create(props);

      expect(driver).toBeDefined();
      expect(driver).toBeInstanceOf(Driver);
      expect(driver.toJSON()).toEqual({
        driver_id: expect.any(Number),
        name: driver.name,
        description: driver.description,
        vehicle: driver.vehicle.toJSON(),
        review: driver.review.toJSON(),
        fee_by_km: driver.fee_by_km,
        minimum_km: driver.minimum_km,
      });
    });
  });

  describe('validations', () => {
    it.each([
      // Driver's name
      {
        // @ts-expect-error - Intentionally passing invalid value to test validation
        getDriver: () => Driver.fake.one().withName(null).build(),
        message: 'Driver name should be a string',
      },
      {
        getDriver: () => Driver.fake.one().withName('').build(),
        message: 'Driver name must be at least 1 character',
      },
      {
        getDriver: () => Driver.fake.one().withName('a'.repeat(256)).build(),
        message: 'Driver name must be at most 255 characters',
      },
      // Driver's description
      {
        // @ts-expect-error - Intentionally passing invalid value to test validation
        getDriver: () => Driver.fake.one().withDescription(null).build(),
        message: 'Driver description should be a string',
      },
      {
        getDriver: () => Driver.fake.one().withDescription('').build(),
        message: 'Driver description must be at least 1 character',
      },
      {
        getDriver: () =>
          Driver.fake.one().withDescription('a'.repeat(256)).build(),
        message: 'Driver description must be at most 255 characters',
      },
      // Driver's fee by km
      {
        // @ts-expect-error - Intentionally passing invalid value to test validation
        getDriver: () => Driver.fake.one().withFeeByKm(null).build(),
        message: 'Driver fee by km should be a number',
      },
      {
        getDriver: () => Driver.fake.one().withFeeByKm(-1).build(),
        message: 'Driver fee by km should be a positive number',
      },
      {
        getDriver: () => Driver.fake.one().withFeeByKm(0).build(),
        message: 'Driver fee by km should be greater than 0',
      },
      // Driver's minimum km
      {
        // @ts-expect-error - Intentionally passing invalid value to test validation
        getDriver: () => Driver.fake.one().withMinimumKm(null).build(),
        message: 'Driver minimum km should be a number',
      },
      {
        getDriver: () => Driver.fake.one().withMinimumKm(-1).build(),
        message: 'Driver minimum km should be a positive number',
      },
    ])('should not allow because "$message"', ({ getDriver, message }) => {
      expect(getDriver().notification).notificationContainsErrorMessages([
        message,
      ]);
    });
  });
});
