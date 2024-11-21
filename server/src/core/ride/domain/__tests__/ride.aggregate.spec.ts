import { Chance } from 'chance';

import { Geolocation } from '../../../../shared/domain/value-objects';
import { CustomerId } from '../../../customer/domain';
import { DriverId } from '../../../driver/domain';
import { Ride } from '../ride.aggregate';
import { RideConstructorProps, RideCreateCommand, RideId } from '../ride.types';

const chance = Chance();

const encodePolyline =
  'j}bk@hfaoFK_FyBJ_CViHd@YDPzEz@l[`@zJL~FHhCFlFZnJFjCf@tQV`HBpCPhGN|B@zAj@lSBbCp@~Rf@nQZjMPdFTlKX~K?`AKrAIr@?h@r@jDJpCV`J\\tKJ|F\\dIRbHd@jODlBEh@QfASh@_@t@{@|@gDdDy@~@gHxGaJhI{A|AQ`@MhAIz@?VYvBQv@qDdMoA|DMh@Ij@I`ACtJKbE@rHPxAfAdHZhBn@tE~C~SNvAC~AGzAhG\\nGXfEZPDn@VfB`A|B~@XjAjArDXfAPd@NW';

const generateRandomLocation = (): Geolocation =>
  new Geolocation(chance.latitude(), chance.longitude(), chance.address());

describe('RideAggregate Unit Tests', () => {
  describe('using constructor', () => {
    it('should create', () => {
      const props: RideConstructorProps = {
        ride_id: new RideId(),
        customer_id: new CustomerId(),
        driver_id: new DriverId(),
        origin: generateRandomLocation(),
        destination: generateRandomLocation(),
        distance: 1,
        duration: '1 min',
        value: 1,
        encoded_polyline: encodePolyline,
      };

      const ride = new Ride(props);

      expect(ride).toBeDefined();
      expect(ride).toBeInstanceOf(Ride);
      expect(ride.toJSON()).toEqual({
        ride_id: props.ride_id.id,
        customer_id: props.customer_id.id,
        driver_id: props.driver_id.id,
        origin: props.origin,
        destination: props.destination,
        distance: props.distance,
        duration: props.duration,
        value: props.value,
        encoded_polyline: props.encoded_polyline,
      });
    });
  });

  describe('using create', () => {
    it('should create', () => {
      const props: RideCreateCommand = {
        customer_id: new CustomerId(),
        driver_id: new DriverId(),
        origin: generateRandomLocation(),
        destination: generateRandomLocation(),
        distance: 1,
        duration: '1 min',
        value: 0,
        encoded_polyline: encodePolyline,
      };

      const ride = Ride.create(props);

      expect(ride).toBeDefined();
      expect(ride).toBeInstanceOf(Ride);
      expect(ride.toJSON()).toEqual({
        ride_id: expect.any(String),
      });
    });
  });
});
