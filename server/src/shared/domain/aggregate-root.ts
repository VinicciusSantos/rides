import EventEmitter2 from 'eventemitter2';

import { Entity, EntityJSON } from './entity';
import { IDomainEvent } from './events';
import { ValueObject } from './value-objects';

export abstract class AggregateRoot<
  JSON = EntityJSON,
  Id = ValueObject,
> extends Entity<JSON, Id> {
  public events: Set<IDomainEvent> = new Set<IDomainEvent>();
  public dispatchedEvents: Set<IDomainEvent> = new Set<IDomainEvent>();
  public localMediator = new EventEmitter2();

  public applyEvent(event: IDomainEvent): void {
    this.events.add(event);
    this.localMediator.emit(event.constructor.name, event);
  }

  public registerHandler(
    event: string,
    handler: (event: IDomainEvent) => void,
  ): void {
    this.localMediator.on(event, handler);
  }

  public markEventAsDispatched(event: IDomainEvent): void {
    this.dispatchedEvents.add(event);
  }

  public getUncommittedEvents(): IDomainEvent[] {
    return Array.from(this.events).filter(
      (event) => !this.dispatchedEvents.has(event),
    );
  }

  public clearEvents(): void {
    this.events.clear();
    this.dispatchedEvents.clear();
  }
}
