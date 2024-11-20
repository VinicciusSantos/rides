import {
  FakeBuilder,
  OptionalFakeFields,
  PropOrFactory,
} from '../../../shared/infra/testing';
import { Car } from './car.vo';
import { Driver } from './driver.aggregate';
import { DriverId, DriverJSON } from './driver.types';

export class DriverFakeBuilder<T, TJSON> extends FakeBuilder<
  Driver,
  DriverJSON,
  T,
  TJSON
> {
  private _driver_id?: PropOrFactory<DriverId> = () =>
    new DriverId(this.chance.integer({ min: 0 }));

  private _name?: PropOrFactory<string> = () => this.chance.name();

  private _description?: PropOrFactory<string> = () => this.chance.sentence();

  private _car?: PropOrFactory<Car> = () =>
    new Car({
      model: this.chance.word(),
      brand: this.chance.word(),
      year: this.chance.integer({ min: 1950, max: new Date().getFullYear() }),
      color: this.chance.color(),
      observations: this.chance.sentence(),
    });

  private _rating?: PropOrFactory<number> = () =>
    this.chance.integer({ min: 0, max: 5 });

  private _fee_by_km?: PropOrFactory<number> = this.chance.integer({ min: 1 });

  private _minimum_km?: PropOrFactory<number> = this.chance.integer({ min: 1 });

  protected optionalFields: OptionalFakeFields<DriverJSON> = [];

  public static one() {
    return new DriverFakeBuilder<Driver, DriverJSON>();
  }

  public static aLot(countObjs: number) {
    return new DriverFakeBuilder<Driver[], DriverJSON[]>(countObjs);
  }

  private constructor(protected countObjs: number = 1) {
    super();
  }

  public withDriverId(valueOrFactory: PropOrFactory<DriverId>): this {
    this._driver_id = valueOrFactory;
    return this;
  }

  public withName(valueOrFactory: PropOrFactory<string>): this {
    this._name = valueOrFactory;
    return this;
  }

  public withDescription(valueOrFactory: PropOrFactory<string>): this {
    this._description = valueOrFactory;
    return this;
  }

  public withCar(valueOrFactory: PropOrFactory<Car>): this {
    this._car = valueOrFactory;
    return this;
  }

  public withRating(valueOrFactory: PropOrFactory<number>): this {
    this._rating = valueOrFactory;
    return this;
  }

  public withFeeByKm(valueOrFactory: PropOrFactory<number>): this {
    this._fee_by_km = valueOrFactory;
    return this;
  }

  public withMinimumKm(valueOrFactory: PropOrFactory<number>): this {
    this._minimum_km = valueOrFactory;
    return this;
  }

  protected buildOne(index: number): Driver {
    const driver = new Driver({
      driver_id: this.callFactory(this._driver_id, index) as DriverId,
      name: this.callFactory(this._name, index) as string,
      description: this.callFactory(this._description, index) as string,
      car: this.callFactory(this._car, index) as Car,
      rating: this.callFactory(this._rating, index) as number,
      fee_by_km: this.callFactory(this._fee_by_km, index) as number,
      minimum_km: this.callFactory(this._minimum_km, index) as number,
    });

    driver.validate();
    return driver;
  }
}
