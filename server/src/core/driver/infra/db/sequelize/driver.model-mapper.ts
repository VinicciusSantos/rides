import { LoadEntityError } from '../../../../../shared/domain/validators';
import { Driver, DriverId } from '../../../domain';
import { Car } from '../../../domain/car.vo';
import { DriverModel, DriverModelProps } from './driver.model';

export class DriverModelMapper {
  public static toEntity(model: DriverModel): Driver {
    const rawData = model.toJSON();
    const driver = new Driver({
      ...rawData,
      driver_id: new DriverId(rawData.driver_id),
      car: new Car({
        brand: rawData.car.brand,
        color: rawData.car.color,
        model: rawData.car.model,
        year: rawData.car.year,
        observations: rawData.car.observations || undefined,
      }),
    });

    driver.validate();

    if (driver.notification.hasErrors()) {
      console.log(
        '🚀 ~ DriverModelMapper ~ toEntity ~ driver.notification.toJSON():',
        driver,
        driver.notification.toJSON(),
      );
      throw new LoadEntityError(driver.notification.toJSON());
    }

    return driver;
  }

  public static toModelProps(entity: Driver): DriverModelProps {
    const driverInfos = entity.toJSON();
    return {
      driver_id: driverInfos.driver_id,
      name: driverInfos.name,
      description: driverInfos.description,
      car: driverInfos.car,
      rating: driverInfos.rating,
      fee_by_km: driverInfos.fee_by_km,
      minimum_km: driverInfos.minimum_km,
    };
  }
}
