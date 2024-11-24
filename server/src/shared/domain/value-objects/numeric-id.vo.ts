import { ValueObject } from './value-object';

export class NumericId extends ValueObject {
  public readonly _id: number;

  public get id(): number {
    return this._id;
  }

  constructor(id?: number) {
    super();
    this._id = id || -1;
  }
}
