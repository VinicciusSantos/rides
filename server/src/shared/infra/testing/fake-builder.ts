import { Chance } from 'chance';
import { isArray, isFunction } from 'lodash';

import { Entity } from '../../domain';

export type PropOrFactory<E> = E | ((index: number) => E);

export type OptionalFakeFields<Model> = (keyof Model)[];

/***
 * FakeBuilder is a class that helps to create fake objects for testing purposes.
 * It simplifies the creation of fake objects by providing a fluent interface to
 * define the properties of the object.
 * @example
 * class UserFakeBuilder extends FakeBuilder...
 * const user = new UserFakeBuilder().one().withName('John').withAge(20).build();
 */
export abstract class FakeBuilder<E extends Entity<Model>, Model, T, TJSON> {
  protected abstract countObjs: number;
  protected abstract optionalFields: OptionalFakeFields<Model>;

  protected abstract buildOne(index: number): E;

  protected chance = Chance();

  protected callFactory<E = unknown>(
    factoryOrValue: PropOrFactory<E>,
    index: number,
  ): E | E[] {
    if (isFunction(factoryOrValue)) {
      return factoryOrValue(index);
    }

    if (isArray(factoryOrValue)) {
      return factoryOrValue.map((value) => this.callFactory(value, index));
    }

    return factoryOrValue;
  }

  protected getValue(prop: keyof Model) {
    const privateProp = `_${prop as string}` as keyof this;
    if (!this[privateProp] && this.optionalFields.includes(prop)) {
      throw new Error(
        `Property ${prop as string} not have a factory, use 'public with' methods`,
      );
    }
    return this.callFactory(this[privateProp], 0);
  }

  public build(): T {
    const entities = new Array(this.countObjs)
      .fill(null)
      .map((_, index) => this.buildOne(index));
    return (this.countObjs === 1 ? entities[0] : entities) as T;
  }

  public buildAsJSON(): TJSON {
    const entitiesBUilded = this.build();
    if (isArray(entitiesBUilded)) {
      return entitiesBUilded.map((entity) => entity.toJSON()) as TJSON;
    }
    return (entitiesBUilded as Entity).toJSON() as TJSON;
  }
}
