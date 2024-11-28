import {
  IRepository,
  SearchParams,
  SearchParamsConstructorProps,
  SearchResult,
} from '../../../shared/domain/repository';
import { RideEstimation } from './ride-estimation.vo';
import { Ride } from './ride.aggregate';
import { RideId } from './ride.types';

export interface RideFilter {
  ride_id?: string;
  customer_id?: string;
  driver_id?: number;
}

export class RideSearchParams extends SearchParams<RideFilter> {
  static create(props?: Partial<SearchParamsConstructorProps<RideFilter>>) {
    return new RideSearchParams({
      ...props,
      page: props?.page ?? 1,
      per_page: SearchParams.resolvePagination(props),
      sort: props?.sort ?? 'ride_id',
      sort_dir: props?.sort_dir ?? 'asc',
    });
  }

  public get filter(): RideFilter | null {
    return this._filter;
  }
}

export class RideSearchResult extends SearchResult<Ride> {}

export interface IRideRepository
  extends IRepository<
    Ride,
    RideId,
    RideFilter,
    RideSearchParams,
    RideSearchResult
  > {
  registerEstimation(estimation: RideEstimation): Promise<void>;
  removeEstimation(estimation_id: number): Promise<void>;
  findEstimation(
    origin: string,
    destination: string,
  ): Promise<RideEstimation | null>;
}
