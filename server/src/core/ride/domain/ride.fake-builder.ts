import { Geolocation } from '../../../shared/domain/value-objects';
import {
  FakeBuilder,
  OptionalFakeFields,
  PropOrFactory,
} from '../../../shared/infra/testing';
import { CustomerId } from '../../customer/domain';
import { Driver, DriverId } from '../../driver/domain';
import { Ride } from './ride.aggregate';
import { RideId, RideJSON } from './ride.types';

export class RideFakeBuilder<T, TJSON> extends FakeBuilder<
  Ride,
  RideJSON,
  T,
  TJSON
> {
  protected optionalFields: OptionalFakeFields<RideJSON> = [];

  private _ride_id: PropOrFactory<RideId> = () => new RideId();

  private _customer_id: PropOrFactory<CustomerId> = () => new CustomerId();

  private _origin: PropOrFactory<Geolocation> = () =>
    new Geolocation(
      this.chance.latitude(),
      this.chance.longitude(),
      this.chance.address(),
    );

  private _destination: PropOrFactory<Geolocation> = () =>
    new Geolocation(
      this.chance.latitude(),
      this.chance.longitude(),
      this.chance.address(),
    );

  private _distance: PropOrFactory<number> = () =>
    this.chance.integer({ min: 0, max: 1_000 });

  private _duration: PropOrFactory<string> = () =>
    `${this.chance.integer({ min: 0, max: 10_000 })}s`;

  private _driver_id?: PropOrFactory<DriverId> = () =>
    new DriverId(this.chance.integer({ min: 0, max: 1_000 }));

  private _value: PropOrFactory<number> = () =>
    this.chance.floating({ min: 0, max: 1_000 });

  private _encoded_polyline: PropOrFactory<string> = () => this.chance.string();

  private _driver: PropOrFactory<Driver> = () => Driver.fake.one().build();

  public static one() {
    return new RideFakeBuilder<Ride, RideJSON>();
  }

  public static aLot(countObjs: number) {
    return new RideFakeBuilder<Ride[], RideJSON[]>(countObjs);
  }

  private constructor(protected countObjs: number = 1) {
    super();
  }

  public withRideId(valueOrFactory: PropOrFactory<RideId>): this {
    this._ride_id = valueOrFactory;
    return this;
  }

  public withCustomerId(valueOrFactory: PropOrFactory<CustomerId>): this {
    this._customer_id = valueOrFactory;
    return this;
  }

  public withOrigin(valueOrFactory: PropOrFactory<Geolocation>): this {
    this._origin = valueOrFactory;
    return this;
  }

  public withDestination(valueOrFactory: PropOrFactory<Geolocation>): this {
    this._destination = valueOrFactory;
    return this;
  }

  public withDistance(valueOrFactory: PropOrFactory<number>): this {
    this._distance = valueOrFactory;
    return this;
  }

  public withDuration(valueOrFactory: PropOrFactory<string>): this {
    this._duration = valueOrFactory;
    return this;
  }

  public withDriverId(valueOrFactory: PropOrFactory<DriverId>): this {
    this._driver_id = valueOrFactory;
    return this;
  }

  public withDriver(valueOrFactory: PropOrFactory<Driver>): this {
    this._driver = valueOrFactory;
    return this;
  }

  public withValue(valueOrFactory: PropOrFactory<number>): this {
    this._value = valueOrFactory;
    return this;
  }

  public withEncodedPolyline(valueOrFactory: PropOrFactory<string>): this {
    this._encoded_polyline = valueOrFactory;
    return this;
  }

  public invalid(): this {
    this._origin = () =>
      new Geolocation(this.chance.latitude(), this.chance.longitude(), '');
    this._destination = () =>
      new Geolocation(this.chance.latitude(), this.chance.longitude(), '');
    this._distance = () => -1;
    this._duration = () => '';
    this._driver_id = () => new DriverId(-1);
    this._value = () => -1;
    this._encoded_polyline = () => '';

    return this;
  }

  protected buildOne(index: number): Ride {
    const ride = new Ride({
      ride_id: this.callFactory(this._ride_id, index) as RideId,
      customer_id: this.callFactory(this._customer_id, index) as CustomerId,
      origin: this.callFactory(this._origin, index) as Geolocation,
      destination: this.callFactory(this._destination, index) as Geolocation,
      distance: this.callFactory(this._distance, index) as number,
      duration: this.callFactory(this._duration, index) as string,
      driver_id: this.callFactory(this._driver_id, index) as DriverId,
      value: this.callFactory(this._value, index) as number,
      encoded_polyline: this.callFactory(
        this._encoded_polyline,
        index,
      ) as string,
      driver: this.callFactory(this._driver, index) as Driver,
    });

    ride.validate();
    return ride;
  }
}
