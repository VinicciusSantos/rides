import { ValueObject } from '../../../shared/domain/value-objects';

export interface CarConstructorProps {
  model: string;
  brand: string;
  year: number;
  color: string;
  observations?: string;
}

export interface CarJSON {
  model: string;
  brand: string;
  year: number;
  color: string;
  observations: string | null;
  formatted_name: string;
}

export class Car extends ValueObject {
  private readonly _model: string;
  private readonly _brand: string;
  private readonly _year: number;
  private readonly _color: string;
  private readonly _observations: string;

  public get model(): string {
    return this._model;
  }

  public get brand(): string {
    return this._brand;
  }

  public get year(): number {
    return this._year;
  }

  public get color(): string {
    return this._color;
  }

  public get observations(): string {
    return this._observations;
  }

  constructor(props: CarConstructorProps) {
    super();
    this._model = props.model;
    this._brand = props.brand;
    this._year = props.year;
    this._color = props.color;
    this._observations = props.observations || '';
  }

  public toJSON(): CarJSON {
    return {
      model: this.model,
      brand: this.brand,
      year: this.year,
      color: this.color,
      observations: this.observations,
      formatted_name:
        `${this._brand} ${this._model} ${this._year} ${this._color} ${this._observations}`.trim(),
    };
  }
}
