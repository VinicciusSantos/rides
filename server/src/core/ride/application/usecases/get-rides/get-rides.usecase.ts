import { IUsecase } from '../../../../../shared/application';
import {
  IRideRepository,
  RideFilter,
  RideSearchParams,
  RideSearchResult,
} from '../../../domain';

export type GetRidesUsecaseInput = RideFilter;

export type GetRidesUsecaseOutput = RideSearchResult;

export class GetRidesUsecase
  implements IUsecase<GetRidesUsecaseInput, GetRidesUsecaseOutput>
{
  constructor(private readonly rideRepo: IRideRepository) {}

  public async execute(
    input: GetRidesUsecaseInput,
  ): Promise<GetRidesUsecaseOutput> {
    const result = await this.rideRepo.findAll(
      RideSearchParams.create({ filter: input }),
    );
    return result.toJSON(true) as GetRidesUsecaseOutput;
  }
}
