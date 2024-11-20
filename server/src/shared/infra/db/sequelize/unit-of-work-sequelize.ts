import { Sequelize, Transaction } from 'sequelize';
import { IUnitOfWork } from '../../../domain/repository/unit-of-work.interface';
import { AggregateRoot } from '../../../domain/aggregate-root';
import { DomainEventModel } from './models';

export class UnitOfWorkSequelize implements IUnitOfWork {
  private transaction!: Transaction | null;
  private aggregateRoots: Set<AggregateRoot> = new Set<AggregateRoot>();

  constructor(private sequelize: Sequelize) {}

  public async start(): Promise<void> {
    if (!this.transaction) {
      this.transaction = await this.sequelize.transaction();
    }
  }

  public async commit(): Promise<void> {
    this.validateTransaction();
    await this.publishDomainEvents();
    await this.transaction!.commit();
    this.transaction = null;
  }

  public async rollback(): Promise<void> {
    this.validateTransaction();
    await this.transaction!.rollback();
    this.transaction = null;
  }

  public getTransaction(): Transaction | null {
    return this.transaction;
  }

  public async do<T>(workFn: (uow: IUnitOfWork) => Promise<T>): Promise<T> {
    let isAutoTransaction = false;
    try {
      if (this.transaction) {
        const result = await workFn(this);
        this.transaction = null;
        return result;
      }

      return await this.sequelize.transaction(async (t) => {
        isAutoTransaction = true;
        this.transaction = t;
        const result = await workFn(this);
        this.transaction = null;
        return result;
      });
    } catch (e) {
      if (!isAutoTransaction) {
        this.transaction?.rollback();
      }
      this.transaction = null;
      throw e;
    }
  }

  private validateTransaction() {
    if (!this.transaction) {
      throw new Error('No transaction started');
    }
  }

  public addAggregateRoot(aggregateRoot: AggregateRoot): void {
    this.aggregateRoots.add(aggregateRoot);
  }

  public getAggregateRoots(): AggregateRoot[] {
    return [...this.aggregateRoots];
  }

  private async publishDomainEvents(): Promise<void> {
    await Promise.all(
      this.getAggregateRoots().reduce((acc, aggregate) => {
        const events = aggregate.getUncommittedEvents().map((event) => {
          aggregate.markEventAsDispatched(event);
          return DomainEventModel.create(event, {
            transaction: this.transaction,
          });
        });

        return acc.concat(events);
      }, [] as Promise<unknown>[]),
    );
  }
}
