import { AggregateRoot } from '../../../domain';
import { IUnitOfWork } from '../../../domain/repository';

export class UnitOfWorkFakeInMemory implements IUnitOfWork {
  private aggregateRoots: Set<AggregateRoot> = new Set<AggregateRoot>();

  constructor() {}

  public getTransaction() {
    return;
  }

  public async start(): Promise<void> {
    return;
  }

  public async commit(): Promise<void> {
    return;
  }

  public async rollback(): Promise<void> {
    return;
  }

  public do<T>(workFn: (uow: IUnitOfWork) => Promise<T>): Promise<T> {
    return workFn(this);
  }

  public addAggregateRoot(aggregateRoot: AggregateRoot): void {
    this.aggregateRoots.add(aggregateRoot);
  }

  public getAggregateRoots(): AggregateRoot[] {
    return [...this.aggregateRoots];
  }
}
