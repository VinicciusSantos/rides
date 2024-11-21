import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { RideStatus } from '../../../domain';

export interface RideModelProps {
  ride_id: string;
  customer_id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver_id: number | null;
  value: number | null;
  status: RideStatus;
}

@Table({ tableName: 't_ride', timestamps: false })
export class RideModel extends Model<RideModelProps> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  public declare ride_id: string;

  // TODO - foreign key
  @Column({ type: DataType.UUID })
  public declare customer_id: string;

  @Column({ type: DataType.STRING })
  public declare origin: string;

  @Column({ type: DataType.STRING })
  public declare destination: string;

  @Column({ type: DataType.FLOAT })
  public declare distance: number;

  @Column({ type: DataType.STRING })
  public declare duration: string;

  // TODO - foreign key
  @Column({ type: DataType.UUID })
  public declare driver_id: string;

  @Column({ type: DataType.FLOAT })
  public declare value: number;

  @Column({ type: DataType.ENUM, values: Object.values(RideStatus) })
  public declare status: RideStatus;
}
