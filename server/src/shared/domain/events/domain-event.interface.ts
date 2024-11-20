export abstract class IDomainEvent<T = unknown> {
  public key: string = this.constructor.name;
  public event_version = 1;
  public occurred_on = new Date();

  public abstract data: T;
}
