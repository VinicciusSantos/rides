import { Entity } from '../../../shared/domain';
import { CustomerId } from '../../customer/domain';
import { DriverId } from '../../driver/domain';
import { RideFakeBuilder } from './ride.fake-builder';
import {
  RideConstructorProps,
  RideCreateCommand,
  RideId,
  RideJSON,
  RideStatus,
} from './ride.types';
import { RideValidator } from './ride.validator';

export class Ride
  extends Entity<RideJSON, RideId>
  implements RideConstructorProps
{
  private readonly _ride_id: RideId;
  private readonly _customer_id: CustomerId;
  private readonly _origin: string;
  private readonly _destination: string;
  private readonly _distance: number;
  private readonly _duration: string;
  private _driver_id?: DriverId;
  private _value?: number;
  private _status: RideStatus;

  public get entity_id(): RideId {
    return this._ride_id;
  }

  public get ride_id(): RideId {
    return this._ride_id;
  }

  public get customer_id(): CustomerId {
    return this._customer_id;
  }

  public get origin(): string {
    return this._origin;
  }

  public get destination(): string {
    return this._destination;
  }

  public get distance(): number {
    return this._distance;
  }

  public get duration(): string {
    return this._duration;
  }

  public get driver_id(): DriverId | undefined {
    return this._driver_id;
  }

  public get value(): number | undefined {
    return this._value;
  }

  public get status(): RideStatus {
    return this._status;
  }

  public static get fake() {
    return RideFakeBuilder;
  }

  public static create(props: RideCreateCommand): Ride {
    const ride = new Ride({
      ...props,
      ride_id: new RideId(),
      status: RideStatus.PENDING,
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
    this._status = props.status;
  }

  public validate(): boolean {
    return new RideValidator().validate(this);
  }

  public toJSON(): RideJSON {
    return {
      ride_id: this.ride_id.id,
      customer_id: this.customer_id.id,
      origin: this.origin,
      destination: this.destination,
      distance: this.distance,
      duration: this.duration,
      driver_id: this.driver_id?.id ?? null,
      value: this.value ?? null,
      status: this.status,
    };
  }
}
