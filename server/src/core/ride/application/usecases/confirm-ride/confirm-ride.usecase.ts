import { IUsecase } from '../../../../../shared/application';
import { IUnitOfWork } from '../../../../../shared/domain/repository';
import { ICustomerRepository } from '../../../../customer/domain';
import { IDriverRepository } from '../../../../driver/domain';
import { IRideRepository } from '../../../domain';

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

export interface ConfirmRideUsecaseOutput {}

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
    if (!customer) {
      throw new Error(`Customer with ID ${input.customer_id} not found`);
    }

    const driver = await this.driverRepo.findOne({
      driver_id: input.driver.id,
    });
    if (!driver) {
      throw new Error(`Driver with ID ${input.driver.id} not found`);
    }

    return {};
  }
}
