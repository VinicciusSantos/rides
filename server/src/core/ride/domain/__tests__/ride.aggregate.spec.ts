import { CustomerId } from '../../../customer/domain';
import { Ride } from '../ride.aggregate';
import {
  RideConstructorProps,
  RideCreateCommand,
  RideId,
  RideStatus,
} from '../ride.types';

describe('RideAggregate Unit Tests', () => {
  describe('using constructor', () => {
    it('should create', () => {
      const props: RideConstructorProps = {
        ride_id: new RideId(),
        customer_id: new CustomerId(),
        origin: 'Rua dos Bobos, 0',
        destination: 'Rua dos Bobos, 1',
        distance: 1,
        duration: '1 min',
        status: RideStatus.CONFIRMED,
      };

      const ride = new Ride(props);

      expect(ride).toBeDefined();
      expect(ride).toBeInstanceOf(Ride);
      expect(ride.toJSON()).toEqual({
        ride_id: props.ride_id.id,
        customer_id: props.customer_id.id,
        origin: props.origin,
        destination: props.destination,
        distance: props.distance,
        duration: props.duration,
        status: props.status,
      });
    });
  });

  describe('using create', () => {
    it('should create', () => {
      const props: RideCreateCommand = {
        customer_id: new CustomerId(),
        origin: 'Rua dos Bobos, 0',
        destination: 'Rua dos Bobos, 1',
        distance: 1,
        duration: '1 min',
      };

      const ride = Ride.create(props);

      expect(ride).toBeDefined();
      expect(ride).toBeInstanceOf(Ride);
      expect(ride.toJSON()).toEqual({
        ride_id: expect.any(String),
      });
    });
  });

  describe('validations', () => {});

  // TODO - add a describe for each oother method
});
