import { Notification } from './validators';
import { ValueObject } from './value-objects';

export type EntityJSON<E = unknown> = Record<string, unknown> & E;

export abstract class Entity<JSON = EntityJSON, Id = ValueObject> {
  public notification: Notification = new Notification();

  public abstract get entity_id(): Id;

  public abstract toJSON(): JSON;
}
