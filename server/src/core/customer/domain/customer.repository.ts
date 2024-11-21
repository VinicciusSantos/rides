import {
  IRepository,
  SearchParams,
  SearchParamsConstructorProps,
  SearchResult,
} from '../../../shared/domain/repository';
import { Customer } from './customer.aggregate';
import { CustomerId } from './customer.types';

export interface CustomerFilter {
  customer_id?: string;
  name?: string;
}

export class CustomerSearchParams extends SearchParams<CustomerFilter> {
  static create(props?: Partial<SearchParamsConstructorProps<CustomerFilter>>) {
    return new CustomerSearchParams({
      ...props,
      page: props?.page ?? 1,
      per_page: props?.paginate ? (props?.per_page ?? 15) : Infinity,
      sort: props?.sort ?? 'name',
      sort_dir: props?.sort_dir ?? 'asc',
    });
  }

  public get filter(): CustomerFilter | null {
    return this._filter;
  }
}

export class CustomerSearchResult extends SearchResult<Customer> {}

export interface ICustomerRepository
  extends IRepository<
    Customer,
    CustomerId,
    CustomerFilter,
    CustomerSearchParams,
    CustomerSearchResult
  > {}
