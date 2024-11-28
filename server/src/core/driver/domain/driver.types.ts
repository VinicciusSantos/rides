import { EntityJSON } from '../../../shared/domain';
import { NumericId } from '../../../shared/domain/value-objects';
import { Review, ReviewJSON, Vehicle, VehicleJSON } from './value-objects';

export class DriverId extends NumericId {}

export interface DriverConstructorProps {
  driver_id: DriverId;
  name: string;
  description: string;
  vehicle: Vehicle;
  review: Review;
  fee_by_km: number;
  minimum_km: number;
}

export interface DriverCreateCommand {
  name: string;
  description: string;
  vehicle: Vehicle;
  review: Review;
  fee_by_km: number;
  minimum_km: number;
}

export type DriverJSON = EntityJSON<{
  driver_id: number;
  name: string;
  description: string;
  vehicle: VehicleJSON;
  review: ReviewJSON;
  fee_by_km: number;
  minimum_km: number;
}>;
