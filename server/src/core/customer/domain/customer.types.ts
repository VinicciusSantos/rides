import { EntityJSON } from '../../../shared/domain';
import { Uuid } from '../../../shared/domain/value-objects';

export class CustomerId extends Uuid {}

export interface CustomerConstructorProps {
  customer_id: CustomerId;
  name: string;
}

export interface CustomerCreateCommand {
  name: string;
}

export type CustomerJSON = EntityJSON<{
  customer_id: string;
  name: string;
}>;
