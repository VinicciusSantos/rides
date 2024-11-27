import { Geolocation } from '../../../../shared/domain/value-objects';
import { Driver, DriverId } from '../../../driver/domain';
import { Ride } from '../ride.aggregate';
import { RideFakeBuilder } from '../ride.fake-builder';
import { RideId } from '../ride.types';

describe('RideFakeBuilder Unit Tests', () => {
  it('should create a ride', () => {
    const ride = RideFakeBuilder.one().build();
    expect(ride).toBeDefined();
    expect(ride).toBeInstanceOf(Ride);
    expect(ride.toJSON()).toEqual(
      expect.objectContaining({
        ride_id: expect.any(String),
        customer_id: expect.any(String),
        driver_id: expect.any(Number),
        origin: {
          latitude: expect.any(Number),
          longitude: expect.any(Number),
          address: expect.any(String),
        },
        destination: {
          latitude: expect.any(Number),
          longitude: expect.any(Number),
          address: expect.any(String),
        },
        distance: expect.any(Number),
        duration: expect.any(String),
        value: expect.any(Number),
        encoded_polyline: expect.any(String),
      }),
    );
  });

  describe('aLot', () => {
    it('should create a lot of rides', () => {
      const count = 5;
      const rides = RideFakeBuilder.aLot(count).build();
      expect(rides).toHaveLength(count);
      for (const ride of rides) {
        expect(ride).toBeInstanceOf(Ride);
      }
    });

    it('should create a lot of rides with custom values', () => {
      const count = 5;

      const uuids = Array(count)
        .fill(null)
        .map(() => new RideId());

      const drivers = Array(count)
        .fill(null)
        .map(() => Driver.fake.one().build());

      const rides = RideFakeBuilder.aLot(count)
        .withRideId((index) => uuids[index])
        .withCustomerId((index) => uuids[index])
        .withDriverId((index) => new DriverId(index + 1))
        .withDriver((index) => drivers[index])
        .withOrigin((index) => new Geolocation(index, index, `Origin ${index}`))
        .withDestination(
          (index) => new Geolocation(index, index, `Destination ${index}`),
        )
        .withDistance((index) => index)
        .withDuration((index) => `${index} mins`)
        .withValue((index) => index)
        .withEncodedPolyline((index) => `encoded-polyline-${index}`)
        .build();

      expect(rides).toHaveLength(count);
      rides.forEach((ride, index) => {
        expect(ride.driver).toBeInstanceOf(Driver);
        expect(ride.toJSON()).toEqual(
          expect.objectContaining({
            ride_id: uuids[index].id,
            customer_id: uuids[index].id,
            driver_id: index + 1,
            origin: new Geolocation(index, index, `Origin ${index}`),
            destination: new Geolocation(index, index, `Destination ${index}`),
            distance: index,
            duration: `${index} mins`,
            value: index,
            encoded_polyline: `encoded-polyline-${index}`,
          }),
        );
      });
    });
  });
});
