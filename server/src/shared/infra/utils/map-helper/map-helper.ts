import { Entity, EntityJSON } from '../../../domain';

export class MapHelper {
  public static entitiesToMap<T extends Entity>(
    entities?: T[],
  ): Map<T['entity_id'], T> {
    return new Map<T['entity_id'], T>(
      (entities || []).map((entity) => [entity.entity_id, entity]),
    );
  }

  public static mapToEntities<T extends Entity>(
    map?: Map<T['entity_id'], T>,
  ): T[] {
    return Array.from(map?.values() || []);
  }

  public static mapToEntityJSON<
    T extends Entity<JSON>,
    JSON extends EntityJSON,
  >(map?: Map<T['entity_id'], T>): JSON[] {
    return MapHelper.mapToEntities<T>(map).map((entity) => entity.toJSON());
  }
}
