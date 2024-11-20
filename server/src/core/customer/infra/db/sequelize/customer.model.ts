import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

export interface CustomerModelProps {
  customer_id: string;
  name: string;
}

@Table({ tableName: 't_customer', timestamps: false })
export class CustomerModel extends Model<CustomerModelProps> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  public declare customer_id: string;

  @Column({ type: DataType.STRING })
  public declare name: string;
}
