import { AggregateRoot } from '../../../shared/domain';
import { Vehicle } from './vehicle.vo';
import { DriverFakeBuilder } from './driver.fake-builder';
import {
  DriverConstructorProps,
  DriverCreateCommand,
  DriverId,
  DriverJSON,
} from './driver.types';
import { DriverValidator } from './driver.validator';

export class Driver
  extends AggregateRoot<DriverJSON, DriverId>
  implements DriverConstructorProps
{
  private readonly _driver_id: DriverId;
  private _name: string;
  private _description: string;
  private _vehicle: Vehicle;
  private _rating: number;
  private _fee_by_km: number;
  private _minimum_km: number;

  public get entity_id(): DriverId {
    return this._driver_id;
  }

  public get driver_id(): DriverId {
    return this._driver_id;
  }

  public get name(): string {
    return this._name;
  }

  public get description(): string {
    return this._description;
  }

  public get vehicle(): Vehicle {
    return this._vehicle;
  }

  public get rating(): number {
    return this._rating;
  }

  public get fee_by_km(): number {
    return this._fee_by_km;
  }

  public get minimum_km(): number {
    return this._minimum_km;
  }

  public static get fake() {
    return DriverFakeBuilder;
  }

  public static create(props: DriverCreateCommand): Driver {
    const driver = new Driver({
      ...props,
      driver_id: new DriverId(),
    });

    driver.validate();
    return driver;
  }

  constructor(props: DriverConstructorProps) {
    super();
    this._driver_id = props.driver_id;
    this._name = props.name;
    this._description = props.description;
    this._vehicle = props.vehicle;
    this._rating = props.rating;
    this._fee_by_km = props.fee_by_km;
    this._minimum_km = props.minimum_km;
  }

  public validate(): boolean {
    return new DriverValidator().validate(this);
  }

  public toJSON(): DriverJSON {
    return {
      driver_id: this.driver_id.id,
      name: this.name,
      description: this.description,
      vehicle: this.vehicle.toJSON(),
      rating: this.rating,
      fee_by_km: this.fee_by_km,
      minimum_km: this.minimum_km,
    };
  }
}
