import { Entity } from '../entity';

export class DuplicatedEntityError extends Error {
  constructor(
    params: unknown,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    entityClass: new (...args: any[]) => Entity,
  ) {
    super(
      `${entityClass.name} with params ${JSON.stringify(params)} is duplicated. Please contact the administrator.`,
    );
    this.name = 'NotFoundError';
  }
}
