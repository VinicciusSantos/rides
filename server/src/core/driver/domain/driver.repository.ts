import {
  IRepository,
  SearchParams,
  SearchParamsConstructorProps,
  SearchResult,
} from '../../../shared/domain/repository';
import { Driver } from './driver.aggregate';
import { DriverId } from './driver.types';

export interface DriverFilter {
  driver_id?: number;
  min_km_lte?: number;
}

export class DriverSearchParams extends SearchParams<DriverFilter> {
  static create(props?: Partial<SearchParamsConstructorProps<DriverFilter>>) {
    return new DriverSearchParams({
      ...props,
      page: props?.page ?? 1,
      per_page: props?.per_page ?? 15,
      sort: props?.sort ?? 'driver_id',
      sort_dir: props?.sort_dir ?? 'asc',
    });
  }

  public get filter(): DriverFilter | null {
    return this._filter;
  }
}

export class DriverSearchResult extends SearchResult<Driver> {}

export interface IDriverRepository
  extends IRepository<
    Driver,
    DriverId,
    DriverFilter,
    DriverSearchParams,
    DriverSearchResult
  > {}
