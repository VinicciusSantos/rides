import { EntityJSON } from '../../../shared/domain';
import { Geolocation, Uuid } from '../../../shared/domain/value-objects';
import { CustomerId } from '../../customer/domain';
import { DriverId } from '../../driver/domain';

export class RideId extends Uuid {}

export interface RideConstructorProps {
  ride_id: RideId;
  customer_id: CustomerId;
  driver_id: DriverId;
  origin: Geolocation;
  destination: Geolocation;
  distance: number;
  duration: string;
  value: number;
  encoded_polyline: string;
}

export interface RideCreateCommand {
  customer_id: CustomerId;
  driver_id: DriverId;
  origin: Geolocation;
  destination: Geolocation;
  distance: number;
  duration: string;
  value: number;
  encoded_polyline: string;
}

export type RideJSON = EntityJSON<{
  ride_id: string;
  customer_id: string;
  origin: Geolocation;
  destination: Geolocation;
  distance: number;
  duration: string;
  driver_id: number;
  value: number;
  encoded_polyline: string;
}>;
