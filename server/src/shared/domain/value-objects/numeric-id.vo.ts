import { ValueObject } from './value-object';

export class NumericId extends ValueObject {
  public readonly id: number;

  constructor(id?: number) {
    super();
    this.id = id || 0;
  }
}
