import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import {
  Geolocation,
  GeolocationJSON,
} from '../../../../../shared/domain/value-objects';
import { DriverModel } from '../../../../driver/infra/db/sequelize';

export interface RideModelProps {
  ride_id: string;
  customer_id: string;
  origin: GeolocationJSON;
  destination: GeolocationJSON;
  distance: number;
  duration: string;
  driver_id: number;
  value: number;
  encoded_polyline: string;
  driver?: DriverModel;
}

@Table({ tableName: 't_ride', timestamps: false })
export class RideModel extends Model<RideModelProps> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  public declare ride_id: string;

  @Column({ type: DataType.UUID })
  public declare customer_id: string;

  @Column({ type: DataType.JSON })
  public declare origin: Geolocation;

  @Column({ type: DataType.JSON })
  public declare destination: Geolocation;

  @Column({ type: DataType.DOUBLE })
  public declare distance: number;

  @Column({ type: DataType.STRING })
  public declare duration: string;

  @ForeignKey(() => DriverModel)
  @Column({ type: DataType.INTEGER })
  public declare driver_id: number;

  @Column({ type: DataType.FLOAT })
  public declare value: number;

  @Column({ type: DataType.TEXT })
  public declare encoded_polyline: string;

  @BelongsTo(() => DriverModel, 'driver_id')
  public declare driver: DriverModel;
}

export interface RideEstimationModelProps {
  id?: number;
  origin: GeolocationJSON;
  destination: GeolocationJSON;
  distance: number;
  duration: string;
  encoded_polyline: string;
  created_at: Date;
}

@Table({ tableName: 't_ride_estimation', timestamps: false })
export class RideEstimationModel extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  public declare id: number;

  @Column({ type: DataType.JSON })
  public declare origin: GeolocationJSON;

  @Column({ type: DataType.JSON })
  public declare destination: GeolocationJSON;

  @Column({ type: DataType.FLOAT })
  public declare distance: number;

  @Column({ type: DataType.STRING })
  public declare duration: string;

  @Column({ type: DataType.TEXT })
  public declare encoded_polyline: string;

  @Column({ type: DataType.DATE })
  public declare created_at: Date;
}
