import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

import { ValueObject } from './value-object';

export class Uuid extends ValueObject {
  public readonly id: string;

  public static mapFrom(uuids: Uuid[]): Map<string, Uuid> {
    return new Map<string, Uuid>(uuids.map((uuid) => [uuid.id, uuid]));
  }

  constructor(id?: string) {
    super();
    this.id = id || uuidv4();
    this.validate();
  }

  private validate(): void {
    const isValid = uuidValidate(this.id);
    if (!isValid) {
      throw new InvalidUuidError();
    }
  }

  public toString(): string {
    return this.id;
  }
}

export class InvalidUuidError extends Error {
  constructor(message?: string) {
    super(message || 'ID must be a valid UUID');
    this.name = 'InvalidUuidError';
  }
}
