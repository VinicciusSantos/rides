import EventEmitter2 from 'eventemitter2';

import { AggregateRoot } from '../../aggregate-root';
import { Uuid, ValueObject } from '../../value-objects';
import { DomainEventMediator } from '../domain-event-mediator';
import { IDomainEvent } from '../domain-event.interface';

class StubEvent extends IDomainEvent<unknown> {
  public occurred_on: Date;
  public event_version: number;
  public data: unknown;

  constructor(
    public aggregate_id: Uuid,
    public name: string,
  ) {
    super();
    this.occurred_on = new Date();
    this.event_version = 1;
  }
}

class StubAggregate extends AggregateRoot {
  public id!: Uuid;
  public name!: string;

  public get entity_id(): ValueObject {
    return this.id;
  }

  public action(name: string): void {
    this.name = name;
    this.applyEvent(new StubEvent(this.id, this.name));
  }

  public toJSON() {
    return {
      id: this.id.toString(),
      name: this.name,
    };
  }
}

describe('DomainEventMediator Unit Tests', () => {
  let mediator: DomainEventMediator;

  beforeEach(() => {
    const eventEmitter = new EventEmitter2();
    mediator = new DomainEventMediator(eventEmitter);
  });

  it('should publish handler', async () => {
    expect.assertions(2);
    mediator.register(StubEvent.name, async (event: StubEvent) => {
      expect(event.name).toBe('test');
    });

    const aggregate = new StubAggregate();
    aggregate.action('test');
    await mediator.publish(aggregate);
    await mediator.publish(aggregate);
  });
});
