import { Entity, EntityJSON } from '../../../domain';
import { Uuid } from '../../../domain/value-objects';
import { MapHelper } from './map-helper';

class TestId extends Uuid {}

type TestJSON = EntityJSON<{
  id: string;
}>;

class TestEntity extends Entity<TestJSON, Uuid> {
  private _id: Uuid;

  public get entity_id(): Uuid {
    return this._id;
  }

  constructor(public id?: string) {
    super();
    this._id = new TestId(id);
  }

  public toJSON(): TestJSON {
    return {
      id: this._id.toString(),
    };
  }
}

describe('MapHelper', () => {
  describe('entitiesToMap', () => {
    it('should return a map with the entities', () => {
      const entities = Array(3)
        .fill(null)
        .map(() => new TestEntity());

      expect(MapHelper.entitiesToMap(entities)).toEqual(
        new Map(entities.map((entity) => [entity.entity_id, entity])),
      );
    });

    it('should return an empty map when entities is undefined', () => {
      expect(MapHelper.entitiesToMap()).toEqual(new Map());
    });
  });

  describe('mapToEntities', () => {
    it('should return an array with the entities', () => {
      const entities = Array(3)
        .fill(null)
        .map(() => new TestEntity());

      const map = new Map(entities.map((entity) => [entity.entity_id, entity]));

      expect(MapHelper.mapToEntities(map)).toEqual(entities);
    });

    it('should return an empty array when map is undefined', () => {
      expect(MapHelper.mapToEntities()).toEqual([]);
    });
  });

  describe('mapToEntityJSON', () => {
    it('should return an array with the entities in JSON format', () => {
      const entities = Array(3)
        .fill(null)
        .map(() => new TestEntity());

      const map = new Map(entities.map((entity) => [entity.entity_id, entity]));

      expect(MapHelper.mapToEntityJSON(map)).toEqual(
        entities.map((entity) => entity.toJSON()),
      );
    });

    it('should return an empty array when map is undefined', () => {
      expect(MapHelper.mapToEntityJSON()).toEqual([]);
    });
  });
});
