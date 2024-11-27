import { Entity } from '../entity';
import { ValueObject } from '../value-objects';

interface SearchResultConstructorProps<E> {
  items: E[];
  total: number;
  current_page: number;
  per_page: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class SearchResult<E = any> extends ValueObject {
  public readonly items: E[];
  public readonly total: number;
  public readonly current_page: number;
  public readonly per_page: number;
  public readonly last_page: number;

  constructor(props: SearchResultConstructorProps<E>) {
    super();
    this.items = props.items;
    this.total = props.total;
    this.current_page = props.current_page;
    this.per_page = props.per_page;
    this.last_page = Math.ceil(this.total / this.per_page);
  }

  public toJSON(forceEntity = false) {
    return {
      items:
        forceEntity && this.items[0] instanceof Entity
          ? this.items.map((item) => (item as Entity).toJSON())
          : this.items,
      total: this.total,
      current_page: this.current_page,
      per_page: this.per_page,
      last_page: this.last_page,
    };
  }
}
