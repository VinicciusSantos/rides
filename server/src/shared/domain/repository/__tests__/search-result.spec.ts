import { Entity } from '../../entity';
import { ValueObject } from '../../value-objects';
import { SearchResult } from '../search-result';

class TestEntity extends Entity {
  get entity_id(): ValueObject {
    throw new Error('Method not implemented.');
  }
  toJSON(): Record<string, unknown> {
    throw new Error('Method not implemented.');
  }
  constructor(public name: string) {
    super();
  }
}

const entity1 = new TestEntity('entity1');
const entity2 = new TestEntity('entity2');

describe('SearchResult Unit Tests', () => {
  test('constructor props', () => {
    let result = new SearchResult<TestEntity>({
      items: [entity1, entity2],
      total: 4,
      current_page: 1,
      per_page: 2,
    });

    expect(result.toJSON()).toStrictEqual({
      items: [entity1, entity2],
      total: 4,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });

    result = new SearchResult({
      items: [entity1, entity2],
      total: 4,
      current_page: 1,
      per_page: 2,
    });

    expect(result.toJSON()).toStrictEqual({
      items: [entity1, entity2],
      total: 4,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
  });

  it('should set last_page = 1 when per_page field is greater than total field', () => {
    const result = new SearchResult({
      items: [],
      total: 4,
      current_page: 1,
      per_page: 15,
    });

    expect(result.last_page).toBe(1);
  });

  test('last_page prop when total is not a multiple of per_page', () => {
    const result = new SearchResult({
      items: [],
      total: 101,
      current_page: 1,
      per_page: 20,
    });

    expect(result.last_page).toBe(6);
  });
});
