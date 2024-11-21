import { IUsecase } from '../../../../../shared/application';
import { IMapsService } from '../../../../../shared/domain/services';
import { GeolocationJSON } from '../../../../../shared/domain/value-objects';
import {
  DriverSearchParams,
  IDriverRepository,
} from '../../../../driver/domain';
import { IRideRepository, RideEstimation } from '../../../domain';

const METERS_TO_KM = 1000;

export interface EstimateRideUsecaseInput {
  customer_id: string;
  origin: string;
  destination: string;
}

export interface EstimateRideUsecaseOutput {
  origin: GeolocationJSON;
  destination: GeolocationJSON;
  distance: number;
  duration: string;
  options: {
    id: number;
    name: string;
    description: string;
    vehicle: string;
    review: { rating: number; comment: string };
    value: number;
  }[];
  routeResponse: unknown;
}

export class EstimateRideUsecase
  implements IUsecase<EstimateRideUsecaseInput, EstimateRideUsecaseOutput>
{
  constructor(
    private readonly rideRepo: IRideRepository,
    private readonly driverRepo: IDriverRepository,
    private readonly mapsService: IMapsService,
  ) {}

  public async execute(
    input: EstimateRideUsecaseInput,
  ): Promise<EstimateRideUsecaseOutput> {
    if (input.origin === input.destination)
      throw new Error('Origin and destination must be different');

    const [origin, destination] = await Promise.all([
      this.mapsService.getCoordinates(input.origin),
      this.mapsService.getCoordinates(input.destination),
    ]);

    if (origin.equals(destination))
      throw new Error('Origin and destination must be different');

    const computedRoute = await this.mapsService.computeRoutesByCar(
      origin,
      destination,
    );

    const driversRes = await this.driverRepo.findAll(
      DriverSearchParams.create({
        filter: { min_km_lte: computedRoute.distanceMeters / METERS_TO_KM },
        paginate: false,
        sort: 'fee_by_km',
        sort_dir: 'asc',
      }),
    );

    await this.rideRepo.registerEstimation(
      new RideEstimation({
        origin,
        destination,
        distance: computedRoute.distanceMeters,
        duration: computedRoute.duration,
        encoded_polyline: computedRoute.polyline.encodedPolyline,
      }),
    );

    return {
      origin: origin.toJSON(),
      destination: destination.toJSON(),
      distance: computedRoute.distanceMeters,
      duration: computedRoute.duration,
      options: driversRes.items.map((item) => {
        const driver = item.toJSON();
        return {
          id: driver.driver_id,
          name: driver.name,
          description: driver.description,
          vehicle: driver.vehicle.formatted_name,
          review: {
            rating: driver.rating,
            comment: 'TODO: Implement review system',
          },
          value:
            driver.fee_by_km * (computedRoute.distanceMeters / METERS_TO_KM),
        };
      }),
      routeResponse: computedRoute,
    };
  }
}
