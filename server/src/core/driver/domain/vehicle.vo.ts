import { ValueObject } from '../../../shared/domain/value-objects';

export interface VehicleConstructorProps {
  model: string;
  brand: string;
  year: number;
  description?: string;
}

export interface VehicleJSON {
  model: string;
  brand: string;
  year: number;
  description: string | null;
  formatted_name: string;
}

export class Vehicle extends ValueObject {
  private readonly _model: string;
  private readonly _brand: string;
  private readonly _year: number;
  private readonly _description: string;

  public get model(): string {
    return this._model;
  }

  public get brand(): string {
    return this._brand;
  }

  public get year(): number {
    return this._year;
  }

  public get description(): string {
    return this._description;
  }

  constructor(props: VehicleConstructorProps) {
    super();
    this._model = props.model;
    this._brand = props.brand;
    this._year = props.year;
    this._description = props.description || '';
  }

  public toJSON(): VehicleJSON {
    return {
      model: this.model,
      brand: this.brand,
      year: this.year,
      description: this.description,
      formatted_name: `${this._brand} ${this._model} ${this._year} ${this._description}`,
    };
  }
}
