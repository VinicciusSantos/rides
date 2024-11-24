import {
  ErrorType,
  InvalidDataError,
} from '../../../../../shared/domain/errors';
import { Driver, DriverId } from '../../../domain';
import { Vehicle } from '../../../domain/vehicle.vo';
import { DriverModel, DriverModelProps } from './driver.model';

export class DriverModelMapper {
  public static toEntity(model: DriverModel): Driver {
    const rawData = model.toJSON();
    const driver = new Driver({
      ...rawData,
      driver_id: new DriverId(rawData.driver_id),
      vehicle: new Vehicle({
        brand: rawData.vehicle.brand,
        description: rawData.vehicle.description,
        model: rawData.vehicle.model,
        year: rawData.vehicle.year,
      }),
      fee_by_km: Number(rawData.fee_by_km),
      minimum_km: Number(rawData.minimum_km),
      rating: Number(rawData.rating),
    });

    driver.validate();

    if (driver.notification.hasErrors()) {
      throw new InvalidDataError(
        ErrorType.ENTITY_VALIDATION,
        driver.notification.toString(),
      );
    }

    return driver;
  }

  public static toModelProps(entity: Driver): DriverModelProps {
    const driverInfos = entity.toJSON();
    return {
      driver_id: driverInfos.driver_id,
      name: driverInfos.name,
      description: driverInfos.description,
      vehicle: driverInfos.vehicle,
      rating: driverInfos.rating,
      fee_by_km: driverInfos.fee_by_km,
      minimum_km: driverInfos.minimum_km,
    };
  }
}
