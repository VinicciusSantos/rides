import EventEmitter2, { ListenerFn } from 'eventemitter2';

import { AggregateRoot } from '../aggregate-root';

export type DomainEventHandler = ListenerFn;

export class DomainEventMediator {
  constructor(private eventEmitter: EventEmitter2) {}

  public register(event: string, handler: DomainEventHandler) {
    this.eventEmitter.on(event, handler);
  }

  public async publish(aggregateRoot: AggregateRoot): Promise<void> {
    for (const event of aggregateRoot.getUncommittedEvents()) {
      const eventClassName = event.constructor.name;
      await this.eventEmitter.emitAsync(eventClassName, event);
    }
  }
}
