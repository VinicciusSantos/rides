import { EntityJSON } from '../../../shared/domain';
import { Uuid } from '../../../shared/domain/value-objects';
import { CustomerId } from '../../customer/domain';
import { DriverId } from '../../driver/domain';

export class RideId extends Uuid {}

export enum RideStatus {
  CONFIRMED = 'CONFIRMED',
  PENDING = 'PENDING',
}

export interface RideConstructorProps {
  ride_id: RideId;
  customer_id: CustomerId;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver_id?: DriverId;
  value?: number;
  status: RideStatus;
}

export interface RideCreateCommand {
  customer_id: CustomerId;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
}

export type RideJSON = EntityJSON<{
  ride_id: string;
  customer_id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver_id: number | null;
  value: number | null;
  status: RideStatus;
}>;
