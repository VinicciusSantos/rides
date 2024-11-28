import { IUsecase } from '../../../../../shared/application';
import { SearchResult } from '../../../../../shared/domain/repository';
import {
  IRideRepository,
  RideFilter,
  RideJSON,
  RideSearchParams,
} from '../../../domain';

export type GetRidesUsecaseInput = RideFilter;

export type GetRidesUsecaseOutput = SearchResult<RideJSON>;

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
