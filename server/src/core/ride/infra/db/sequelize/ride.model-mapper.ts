import {
  ErrorType,
  InvalidDataError,
} from '../../../../../shared/domain/errors';
import { Geolocation } from '../../../../../shared/domain/value-objects';
import { CustomerId } from '../../../../customer/domain';
import { DriverId } from '../../../../driver/domain';
import { Ride, RideEstimation, RideId } from '../../../domain';
import {
  RideEstimationModel,
  RideEstimationModelProps,
  RideModel,
  RideModelProps,
} from './ride.model';

export class RideModelMapper {
  public static toEntity(model: RideModel): Ride {
    const rawData = model.toJSON();
    const ride = new Ride({
      ...rawData,
      ride_id: new RideId(rawData.ride_id),
      customer_id: new CustomerId(rawData.customer_id),
      driver_id: new DriverId(rawData.driver_id),
      origin: new Geolocation(
        rawData.origin.latitude,
        rawData.origin.longitude,
        rawData.origin.address ?? undefined,
      ),
      destination: new Geolocation(
        rawData.destination.latitude,
        rawData.destination.longitude,
        rawData.destination.address ?? undefined,
      ),
      value: rawData.value ?? undefined,
    });

    ride.validate();

    if (ride.notification.hasErrors()) {
      throw new InvalidDataError(
        ErrorType.ENTITY_VALIDATION,
        ride.notification.toString(),
      );
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
      encoded_polyline: rideInfos.encoded_polyline,
    };
  }
}

export class RideEstimationModelMapper {
  public static toValueObject(model: RideEstimationModel): RideEstimation {
    const rawData = model.toJSON();
    return new RideEstimation({
      id: rawData.id,
      origin: new Geolocation(
        rawData.origin.latitude,
        rawData.origin.longitude,
        rawData.origin.address ?? undefined,
      ),
      destination: new Geolocation(
        rawData.destination.latitude,
        rawData.destination.longitude,
        rawData.destination.address ?? undefined,
      ),
      distance: rawData.distance,
      duration: rawData.duration,
      encoded_polyline: rawData.encoded_polyline,
      created_at: rawData.created_at,
    });
  }

  public static toModelProps(vo: RideEstimation): RideEstimationModelProps {
    const estimationInfos = vo.toJSON();
    return {
      id: estimationInfos.id,
      origin: estimationInfos.origin.toJSON(),
      destination: estimationInfos.destination.toJSON(),
      distance: estimationInfos.distance,
      duration: estimationInfos.duration,
      encoded_polyline: estimationInfos.encoded_polyline,
      created_at: estimationInfos.created_at,
    };
  }
}
