import { isEmpty } from 'class-validator';
import { isNull, isUndefined } from 'lodash';
import { ValueObject } from '../value-objects';

export type SortDirection = 'asc' | 'desc';

export interface SearchParamsConstructorProps<Filter = string> {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: Filter | null;
}

export class SearchParams<Filter = string> extends ValueObject {
  protected _page!: number;
  protected _per_page: number = 15;
  protected _sort!: string | null;
  protected _sort_dir!: SortDirection | null;
  protected _filter!: Filter | null;

  public get page() {
    return this._page;
  }

  public get offset(): number {
    return (this.page - 1) * this.per_page;
  }

  public set page(value: number) {
    let _page = Number(value);

    if (
      Number.isNaN(_page) ||
      _page <= 0 ||
      parseInt(String(_page)) !== _page
    ) {
      _page = 1;
    }

    this._page = _page;
  }

  public get per_page() {
    return this._per_page;
  }

  public set per_page(value: number) {
    let _per_page = Number(value);

    if (
      Number.isNaN(_per_page) ||
      _per_page <= 0 ||
      parseInt(String(_per_page)) !== _per_page
    ) {
      _per_page = this._per_page;
    }

    this._per_page = _per_page;
  }

  public get sort(): string | null {
    return this._sort;
  }

  public set sort(value: string | null) {
    this._sort =
      value === null || value === undefined || value === '' ? null : `${value}`;
  }

  public get sort_dir(): SortDirection | null {
    return this._sort_dir;
  }

  public set sort_dir(value: SortDirection | null) {
    if (!this.sort) {
      this._sort_dir = null;
      return;
    }
    const dir = `${value}`.toLowerCase();
    this._sort_dir = dir !== 'asc' && dir !== 'desc' ? 'asc' : dir;
  }

  public get filter(): Filter | null {
    return this._filter;
  }

  public set filter(value: Filter | null) {
    this._filter =
      value === null || value === undefined || (value as unknown) === ''
        ? null
        : (`${value}` as Filter);
  }

  constructor(props: SearchParamsConstructorProps<Filter> = {}) {
    super();
    this.page = props.page!;
    this.per_page = props.per_page!;
    this.sort = props.sort!;
    this.sort_dir = props.sort_dir!;
    this.validateFilters(props.filter);
  }

  private validateFilters(filters?: Filter | null): void {
    this._filter =
      isNull(filters) || isUndefined(filters) || isEmpty(filters)
        ? null
        : filters;
  }
}
