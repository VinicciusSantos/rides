import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { IDomainEvent } from '../../../../domain/events';

export interface DomainEventModelProps extends IDomainEvent {}

@Table({ tableName: 't_domain_event', timestamps: false })
export class DomainEventModel extends Model<DomainEventModelProps> {
  @PrimaryKey
  @Column({ type: DataType.STRING(128) })
  public declare key: string;

  @Column({ type: DataType.JSON })
  public declare data: DomainEventModelProps['data'];

  @Column({ type: DataType.INTEGER })
  public declare event_version: DomainEventModelProps['event_version'];

  @Column({ type: DataType.DATE })
  public declare occurred_on: DomainEventModelProps['occurred_on'];
}
