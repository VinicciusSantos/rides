import { IUsecase } from '../../../../../shared/application';
import { SearchResult } from '../../../../../shared/domain/repository';
import {
  IDriverRepository,
  Driver,
  DriverSearchParams,
  DriverFilter,
} from '../../../domain';

export type GetDriversUsecaseInput = DriverFilter;

export type GetDriversUsecaseOutput = SearchResult<Driver>;

export class GetDriversUsecase
  implements IUsecase<GetDriversUsecaseInput, GetDriversUsecaseOutput>
{
  constructor(private readonly driverRepo: IDriverRepository) {}

  public async execute(
    input: GetDriversUsecaseInput,
  ): Promise<GetDriversUsecaseOutput> {
    const result = await this.driverRepo.findAll(
      DriverSearchParams.create({ filter: input }),
    );
    return result.toJSON(true) as GetDriversUsecaseOutput;
  }
}
