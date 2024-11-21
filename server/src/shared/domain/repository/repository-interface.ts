import { Entity } from '../entity';
import { ValueObject } from '../value-objects';
import { SearchParams } from './search-params';
import { SearchResult } from './search-result';

export interface IRepository<
  E extends Entity,
  EntityId extends ValueObject,
  Filter = Record<string, unknown>,
  SearchInput = SearchParams<Filter>,
  SearchOutput = SearchResult,
> {
  sortableFields: string[];
  insert(entity: E): Promise<void>;
  findOne(filter: Filter): Promise<E | null>;
  findAll(props?: SearchInput): Promise<SearchOutput>;
  update(entity: E): Promise<void>;
  delete(entity_id: EntityId): Promise<void>;
}
