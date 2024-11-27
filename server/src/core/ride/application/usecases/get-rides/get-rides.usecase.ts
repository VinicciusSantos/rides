import { IUsecase } from '../../../../../shared/application';
import { SearchResult } from '../../../../../shared/domain/repository';
import { GeolocationJSON } from '../../../../../shared/domain/value-objects';
import { IRideRepository, RideFilter, RideSearchParams } from '../../../domain';

export type GetRidesUsecaseInput = RideFilter;

export type GetRidesUsecaseOutput = SearchResult<{
  driver_name: string;
  origin: GeolocationJSON;
  destination: GeolocationJSON;
  distance: number;
  duration: number;
  value: number;
}>;

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
