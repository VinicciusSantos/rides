import { EntityJSON } from '../../../shared/domain';
import { NumericId } from '../../../shared/domain/value-objects';
import { Car, CarJSON } from './car.vo';

export class DriverId extends NumericId {}

export interface DriverConstructorProps {
  driver_id: DriverId;
  name: string;
  description: string;
  car: Car;
  rating: number;
  fee_by_km: number;
  minimum_km: number;
}

export interface DriverCreateCommand {
  name: string;
  description: string;
  car: Car;
  rating: number;
  fee_by_km: number;
  minimum_km: number;
}

export type DriverJSON = EntityJSON<{
  driver_id: number;
  name: string;
  description: string;
  car: CarJSON;
  rating: number;
  fee_by_km: number;
  minimum_km: number;
}>;
