import { AggregateRoot } from '../aggregate-root';
import { IDomainEvent } from '../events';
import { Uuid } from '../value-objects';

class StubEvent extends IDomainEvent<unknown> {
  public occurred_on: Date;
  public event_version: number = 1;
  public data: unknown;

  constructor(
    public aggregate_id: Uuid,
    public name: string,
  ) {
    super();
    this.occurred_on = new Date();
  }
}

class StubAggregateRoot extends AggregateRoot {
  public aggregate_id: Uuid;
  public name: string;
  public field1!: string;

  public get entity_id() {
    return this.aggregate_id;
  }

  constructor(name: string, id: Uuid) {
    super();
    this.aggregate_id = id;
    this.name = name;
    this.registerHandler(StubEvent.name, (event: IDomainEvent) =>
      this.onStubEvent(event as StubEvent),
    );
  }

  public operation(): void {
    this.name = this.name.toUpperCase();
    this.applyEvent(new StubEvent(this.aggregate_id, this.name));
  }

  public onStubEvent(event: StubEvent): void {
    this.field1 = event.name;
  }

  public toJSON() {
    return {
      aggregate_id: this.aggregate_id,
      name: this.name,
      field1: this.field1,
    };
  }
}

describe('AggregateRoot Unit Tests', () => {
  test('dispatch events', () => {
    const id = new Uuid();
    const aggregate = new StubAggregateRoot('test name', id);
    aggregate.operation();
    expect(aggregate.field1).toBe('TEST NAME');
  });
});
