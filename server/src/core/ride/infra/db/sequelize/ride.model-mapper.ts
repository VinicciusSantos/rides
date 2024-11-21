import { LoadEntityError } from '../../../../../shared/domain/validators';
import { CustomerId } from '../../../../customer/domain';
import { DriverId } from '../../../../driver/domain';
import { Ride, RideId } from '../../../domain';
import { RideModel, RideModelProps } from './ride.model';

export class RideModelMapper {
  public static toAggregate(model: RideModel): Ride {
    const rawData = model.toJSON();
    const ride = new Ride({
      ...rawData,
      ride_id: new RideId(rawData.ride_id),
      customer_id: new CustomerId(rawData.customer_id),
      driver_id: rawData.driver_id
        ? new DriverId(rawData.driver_id)
        : undefined,
      value: rawData.value ?? undefined,
    });

    ride.validate();

    if (ride.notification.hasErrors()) {
      throw new LoadEntityError(ride.notification.toJSON());
    }

    return ride;
  }

  public static toModelProps(aggregate: Ride): RideModelProps {
    const rideInfos = aggregate.toJSON();
    return {
      ride_id: rideInfos.ride_id,
      customer_id: rideInfos.customer_id,
      origin: rideInfos.origin,
      destination: rideInfos.destination,
      distance: rideInfos.distance,
      duration: rideInfos.duration,
      driver_id: rideInfos.driver_id,
      value: rideInfos.value,
      status: rideInfos.status,
    };
  }
}
