import { Geolocation } from '../../../shared/domain/value-objects';
import {
  FakeBuilder,
  OptionalFakeFields,
  PropOrFactory,
} from '../../../shared/infra/testing';
import { CustomerId } from '../../customer/domain';
import { DriverId } from '../../driver/domain';
import { Ride } from './ride.aggregate';
import { RideId, RideJSON } from './ride.types';

export class RideFakeBuilder<T, TJSON> extends FakeBuilder<
  Ride,
  RideJSON,
  T,
  TJSON
> {
  protected optionalFields: OptionalFakeFields<RideJSON> = [];

  private _ride_id?: PropOrFactory<RideId> = () => new RideId();

  private customer_id: PropOrFactory<CustomerId> = () => new CustomerId();

  private origin: PropOrFactory<Geolocation> = () =>
    new Geolocation(
      this.chance.latitude(),
      this.chance.longitude(),
      this.chance.address(),
    );

  private destination: PropOrFactory<Geolocation> = () =>
    new Geolocation(
      this.chance.latitude(),
      this.chance.longitude(),
      this.chance.address(),
    );

  private distance: PropOrFactory<number> = () => this.chance.natural();

  private duration: PropOrFactory<string> = () => this.chance.string();

  private driver_id?: PropOrFactory<DriverId> = () => new DriverId();

  private value: PropOrFactory<number> = () => this.chance.floating();

  private encoded_polyline: PropOrFactory<string> = () => this.chance.string();

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
    this.customer_id = valueOrFactory;
    return this;
  }

  public withOrigin(valueOrFactory: PropOrFactory<Geolocation>): this {
    this.origin = valueOrFactory;
    return this;
  }

  public withDestination(valueOrFactory: PropOrFactory<Geolocation>): this {
    this.destination = valueOrFactory;
    return this;
  }

  public withDistance(valueOrFactory: PropOrFactory<number>): this {
    this.distance = valueOrFactory;
    return this;
  }

  public withDuration(valueOrFactory: PropOrFactory<string>): this {
    this.duration = valueOrFactory;
    return this;
  }

  public withDriverId(valueOrFactory: PropOrFactory<DriverId>): this {
    this.driver_id = valueOrFactory;
    return this;
  }

  public withValue(valueOrFactory: PropOrFactory<number>): this {
    this.value = valueOrFactory;
    return this;
  }

  public withEncodedPolyline(valueOrFactory: PropOrFactory<string>): this {
    this.encoded_polyline = valueOrFactory;
    return this;
  }

  protected buildOne(index: number): Ride {
    const ride = new Ride({
      ride_id: this.callFactory(this._ride_id, index) as RideId,
      customer_id: this.callFactory(this.customer_id, index) as CustomerId,
      origin: this.callFactory(this.origin, index) as Geolocation,
      destination: this.callFactory(this.destination, index) as Geolocation,
      distance: this.callFactory(this.distance, index) as number,
      duration: this.callFactory(this.duration, index) as string,
      driver_id: this.callFactory(this.driver_id, index) as DriverId,
      value: this.callFactory(this.value, index) as number,
      encoded_polyline: this.callFactory(
        this.encoded_polyline,
        index,
      ) as string,
    });

    ride.validate();
    return ride;
  }
}
