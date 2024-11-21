import { Ride } from '../ride.aggregate';
import { RideFakeBuilder } from '../ride.fake-builder';
import { RideId } from '../ride.types';

describe('RideFakeBuilder Unit Tests', () => {
  describe('one', () => {
    it('should create a ride', () => {
      const ride = RideFakeBuilder.one().build();
      expect(ride).toBeDefined();
      expect(ride).toBeInstanceOf(Ride);
      expect(ride.toJSON()).toEqual({
        // TODO - Add other fields
        ride_id: expect.any(String),
      });
    });

    describe('withRideId', () => {
      it('should create a ride with a custom ride_id', () => {
        const rideId = new RideId();
        const ride = RideFakeBuilder.one().withRideId(rideId).build();
        expect(ride.entity_id).toBe(rideId);
      });

      it('should create a ride with a custom ride_id factory', () => {
        const rideId = new RideId();
        const ride = RideFakeBuilder.one()
          .withRideId(() => rideId)
          .build();
        expect(ride.entity_id).toBeInstanceOf(RideId);
      });
    });

    // TODO - add describe blocks for other methods "withXXX"
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

      const rides = RideFakeBuilder.aLot(count)
        // TODO - Add all other custom "withXXX" methods here
        .withRideId((index) => uuids[index])
        .build();

      expect(rides).toHaveLength(count);
      rides.forEach((ride, index) => {
        expect(ride.toJSON()).toEqual({
          // TODO - Add all other fields here
          ride_id: uuids[index].id,
        });
      });
    });
  });
});
