import { IDomainEvent } from '../domain/events';

export interface IDomainEventHandler {
  handle(event: IDomainEvent): Promise<void>;
}
