import { Entity } from '../entity';

export class NotFoundError extends Error {
  constructor(
    id: unknown[] | unknown,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    entityClass: new (...args: any[]) => Entity,
  ) {
    const idsMessage = Array.isArray(id) ? id.join(', ') : id;
    super(`${entityClass.name} not found using ID ${idsMessage}`);
    this.name = 'NotFoundError';
  }
}
