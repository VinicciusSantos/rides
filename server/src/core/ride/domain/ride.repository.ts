import {
  IRepository,
  SearchParams,
  SearchParamsConstructorProps,
  SearchResult,
} from '../../../shared/domain/repository';
import { Ride } from './ride.aggregate';
import { RideId } from './ride.types';

export interface RideFilter {
  ride_id?: string;
  driver_id?: string;
}

export class RideSearchParams extends SearchParams<RideFilter> {
  static create(props?: Partial<SearchParamsConstructorProps<RideFilter>>) {
    return new RideSearchParams({
      ...props,
      page: props?.page ?? 1,
      per_page: props?.per_page ?? 15,
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
  > {}
