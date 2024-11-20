import { isArray } from 'lodash';
import { Entity } from '../../../domain';
import { DuplicatedEntityError, NotFoundError } from '../../../domain/errors';
import {
  IRepository,
  SearchParams,
  SearchResult,
  SortDirection,
} from '../../../domain/repository';
import { ValueObject } from '../../../domain/value-objects';

export abstract class InMemoryRepository<
  E extends Entity,
  EntityId extends ValueObject,
  Filter,
> implements IRepository<E, EntityId, Filter>
{
  public abstract sortableFields: string[];
  public items: E[] = [];

  public async insert(entity: E): Promise<void> {
    this.items.push(entity);
  }

  public async update(entity: E): Promise<void> {
    const indexFound = this.items.findIndex((item) =>
      item.entity_id.equals(entity.entity_id),
    );
    if (indexFound === -1) {
      throw new NotFoundError(entity.entity_id, this.getEntity());
    }
    this.items[indexFound] = entity;
  }

  public async delete(entity_id: EntityId): Promise<void> {
    const indexFound = this.items.findIndex((item) =>
      item.entity_id.equals(entity_id),
    );
    if (indexFound === -1) {
      throw new NotFoundError(entity_id, this.getEntity());
    }
    this.items.splice(indexFound, 1);
  }

  public async findOne(filters: Filter): Promise<E | null> {
    const data = await this.applyFilter(this.items, filters);

    if (isArray(data) && data.length > 1) {
      throw new DuplicatedEntityError(filters, this.getEntity());
    }

    return data[0] || null;
  }

  public async findAll(
    props: SearchParams<Filter> = new SearchParams(),
  ): Promise<SearchResult<E>> {
    const itemsFiltered = await this.applyFilter(this.items, props.filter!);
    const itemsSorted = this.applySort(
      itemsFiltered,
      props.sort as keyof E,
      props.sort_dir,
    );
    const itemsPaginated = this.applyPaginate(
      itemsSorted,
      props.page,
      props.per_page,
    );
    return new SearchResult({
      items: itemsPaginated,
      total: itemsFiltered.length,
      current_page: props.page,
      per_page: props.per_page,
    });
  }

  protected abstract applyFilter(items: E[], filter: Filter): Promise<E[]>;

  protected applyPaginate(
    items: E[],
    page: SearchParams['page'],
    per_page: SearchParams['per_page'],
  ) {
    const start = (page - 1) * per_page; // 0 * 15 = 0
    const limit = start + per_page; // 0 + 15 = 15
    return items.slice(start, limit);
  }

  protected applySort(
    items: E[],
    sort: keyof E | null,
    sort_dir: SortDirection | null,
    custom_getter?: (sort: keyof E, item: E) => unknown,
  ) {
    if (!sort || !this.sortableFields.includes(sort as string)) {
      return items;
    }

    return [...items].sort((a, b) => {
      const aValue = (
        custom_getter ? custom_getter(sort, a) : a[sort]
      ) as number;
      const bValue = (
        custom_getter ? custom_getter(sort, b) : b[sort]
      ) as number;
      if (aValue < bValue) {
        return sort_dir === 'asc' ? -1 : 1;
      }

      if (aValue > bValue) {
        return sort_dir === 'asc' ? 1 : -1;
      }

      return 0;
    });
  }

  public abstract getEntity(): new (...args: unknown[]) => E;
}
