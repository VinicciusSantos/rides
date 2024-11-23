import { IUsecase } from '../../../../../shared/application';
import { IUnitOfWork } from '../../../../../shared/domain/repository';
import {
  LoadEntityError,
  Notification,
} from '../../../../../shared/domain/validators';
import { ICustomerRepository } from '../../../../customer/domain';
import { Driver, IDriverRepository } from '../../../../driver/domain';
import { IRideRepository, Ride, RideEstimation } from '../../../domain';

const METERS_TO_KM = 1000;

export interface ConfirmRideUsecaseInput {
  customer_id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: {
    id: number;
    name: string;
  };
  value: number;
}

export type ConfirmRideUsecaseOutput = void;

export class ConfirmRideUsecase
  implements IUsecase<ConfirmRideUsecaseInput, ConfirmRideUsecaseOutput>
{
  constructor(
    private readonly uow: IUnitOfWork,
    private readonly rideRepo: IRideRepository,
    private readonly customerRepo: ICustomerRepository,
    private readonly driverRepo: IDriverRepository,
  ) {}

  public async execute(
    input: ConfirmRideUsecaseInput,
  ): Promise<ConfirmRideUsecaseOutput> {
    const { customer_id } = input;
    const customer = await this.customerRepo.findOne({ customer_id });
    if (!customer) throw new Error(`Customer with ID ${customer_id} not found`);

    const driver_id = input.driver.id;
    const driver = await this.driverRepo.findOne({ driver_id });
    if (!driver) throw new Error(`Driver with ID ${input.driver.id} not found`);

    const estimatedRide = await this.rideRepo.findEstimation(
      input.origin,
      input.destination,
    );
    if (!estimatedRide) {
      throw new Error(
        'This ride was not estimated. Are you trying to cheat the system? 0_o',
      );
    }

    const rideValidations = this.validateRide(input, estimatedRide, driver);
    if (rideValidations.hasErrors())
      throw new LoadEntityError(rideValidations.toJSON());

    const newRide = Ride.create({
      customer_id: customer.customer_id,
      driver_id: driver.driver_id,
      origin: estimatedRide.origin,
      destination: estimatedRide.destination,
      distance: estimatedRide.distance,
      duration: estimatedRide.duration,
      value: input.value,
      encoded_polyline: estimatedRide.encoded_polyline,
    });

    await this.uow.do(async () => {
      await Promise.all([
        this.rideRepo.removeEstimation(estimatedRide.id),
        this.rideRepo.insert(newRide),
      ]);
    });
  }

  private validateRide(
    input: ConfirmRideUsecaseInput,
    estimatedRide: RideEstimation,
    driver: Driver,
  ): Notification {
    const defaultMsg = 'Error in ride validation: ';
    const notification = new Notification();

    if (input.origin !== estimatedRide.origin.address)
      notification.addError(defaultMsg + 'Invalid origin');

    if (input.destination !== estimatedRide.destination.address)
      notification.addError(defaultMsg + 'Invalid destination');

    if (input.distance !== estimatedRide.distance)
      notification.addError(defaultMsg + 'Invalid distance');

    if (input.duration !== estimatedRide.duration)
      notification.addError(defaultMsg + 'Invalid duration');

    const expectedValue =
      driver.fee_by_km * (estimatedRide.distance / METERS_TO_KM);

    if (input.value !== expectedValue) {
      notification.addError(
        defaultMsg + `Invalid ride value: expected: ${expectedValue}`,
      );
    }

    return notification;
  }
}
