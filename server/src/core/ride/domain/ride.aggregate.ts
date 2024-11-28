import { Entity } from '../../../shared/domain';
import { Geolocation } from '../../../shared/domain/value-objects';
import { CustomerId } from '../../customer/domain';
import { Driver, DriverId } from '../../driver/domain';
import { RideFakeBuilder } from './ride.fake-builder';
import {
  RideConstructorProps,
  RideCreateCommand,
  RideId,
  RideJSON,
} from './ride.types';
import { RideValidator } from './ride.validator';

export class Ride
  extends Entity<RideJSON, RideId>
  implements RideConstructorProps
{
  private readonly _ride_id: RideId;
  private readonly _customer_id: CustomerId;
  private readonly _origin: Geolocation;
  private readonly _destination: Geolocation;
  private readonly _distance: number;
  private readonly _duration: string;
  private _driver_id: DriverId;
  private _value: number;
  private _encoded_polyline: string;
  private _driver: Driver | undefined;

  public get entity_id(): RideId {
    return this._ride_id;
  }

  public get ride_id(): RideId {
    return this._ride_id;
  }

  public get customer_id(): CustomerId {
    return this._customer_id;
  }

  public get origin(): Geolocation {
    return this._origin;
  }

  public get destination(): Geolocation {
    return this._destination;
  }

  public get distance(): number {
    return this._distance;
  }

  public get duration(): string {
    return this._duration;
  }

  public get driver_id(): DriverId {
    return this._driver_id;
  }

  public get value(): number {
    return this._value;
  }

  public get encoded_polyline(): string {
    return this._encoded_polyline;
  }

  public get driver(): Driver | undefined {
    return this._driver;
  }

  public static get fake() {
    return RideFakeBuilder;
  }

  public static create(props: RideCreateCommand): Ride {
    const ride = new Ride({
      ...props,
      ride_id: new RideId(),
    });

    ride.validate();
    return ride;
  }

  constructor(props: RideConstructorProps) {
    super();
    this._ride_id = props.ride_id;
    this._customer_id = props.customer_id;
    this._origin = props.origin;
    this._destination = props.destination;
    this._distance = props.distance;
    this._duration = props.duration;
    this._driver_id = props.driver_id;
    this._value = props.value;
    this._encoded_polyline = props.encoded_polyline;
    this._driver = props.driver;
  }

  public validate(): boolean {
    return new RideValidator().validate(this);
  }

  public toJSON(): RideJSON {
    return {
      ride_id: this.ride_id.toString(),
      customer_id: this.customer_id.toString(),
      origin: this.origin.toJSON(),
      destination: this.destination.toJSON(),
      distance: this.distance,
      duration: this.duration,
      value: this.value,
      encoded_polyline: this.encoded_polyline,
      driver_id: this.driver_id.id,
      driver: this.driver ? this.driver.toJSON() : null,
    };
  }
}
