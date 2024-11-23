import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { VehicleJSON } from '../../../domain/vehicle.vo';

export interface DriverModelProps {
  driver_id: number;
  name: string;
  description: string;
  vehicle: VehicleJSON;
  rating: number;
  fee_by_km: number;
  minimum_km: number;
}

@Table({ tableName: 't_driver', timestamps: false })
export class DriverModel extends Model<DriverModelProps> {
  @PrimaryKey
  @Column({ autoIncrement: true, type: DataType.INTEGER })
  public declare driver_id: number;

  @Column({ type: DataType.STRING })
  public declare name: string;

  @Column({ type: DataType.STRING })
  public declare description: string;

  @Column({ type: DataType.JSON })
  public declare vehicle: VehicleJSON;

  @Column({ type: DataType.FLOAT })
  public declare rating: number;

  @Column({ type: DataType.FLOAT })
  public declare fee_by_km: number;

  @Column({ type: DataType.FLOAT })
  public declare minimum_km: number;
}
