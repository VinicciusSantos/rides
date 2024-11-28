import {
  FakeBuilder,
  OptionalFakeFields,
  PropOrFactory,
} from '../../../shared/infra/testing';
import { Driver } from './driver.aggregate';
import { DriverId, DriverJSON } from './driver.types';
import { Review, Vehicle } from './value-objects';

export class DriverFakeBuilder<T, TJSON> extends FakeBuilder<
  Driver,
  DriverJSON,
  T,
  TJSON
> {
  private _driver_id?: PropOrFactory<DriverId> = () =>
    new DriverId(this.chance.integer({ min: 0, max: 1000 }));

  private _name?: PropOrFactory<string> = () => this.chance.name();

  private _description?: PropOrFactory<string> = () => this.chance.sentence();

  private _vehicle?: PropOrFactory<Vehicle> = () =>
    new Vehicle({
      model: this.chance.word(),
      brand: this.chance.word(),
      year: this.chance.integer({ min: 1950, max: new Date().getFullYear() }),
      description: this.chance.sentence(),
    });

  private _review?: PropOrFactory<Review> = () =>
    new Review({
      rating: this.chance.integer({ min: 1, max: 5 }),
      comment: this.chance.sentence(),
    });

  private _fee_by_km?: PropOrFactory<number> = this.chance.integer({
    min: 1,
    max: 100,
  });

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

  public withCar(valueOrFactory: PropOrFactory<Vehicle>): this {
    this._vehicle = valueOrFactory;
    return this;
  }

  public withReview(valueOrFactory: PropOrFactory<Review>): this {
    this._review = valueOrFactory;
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

  public invalid(): this {
    this._name = () => '';
    this._description = () => this.chance.string({ length: 256 });
    this._vehicle = () =>
      new Vehicle({
        model: '',
        brand: '',
        year: 0,
        description: this.chance.string({ length: 256 }),
      });
    this._review = () => new Review({ rating: 10000, comment: '' });
    this._fee_by_km = () => 0;
    this._minimum_km = () => -1;
    return this;
  }

  protected buildOne(index: number): Driver {
    const driver = new Driver({
      driver_id: this.callFactory(this._driver_id, index) as DriverId,
      name: this.callFactory(this._name, index) as string,
      description: this.callFactory(this._description, index) as string,
      vehicle: this.callFactory(this._vehicle, index) as Vehicle,
      review: this.callFactory(this._review, index) as Review,
      fee_by_km: this.callFactory(this._fee_by_km, index) as number,
      minimum_km: this.callFactory(this._minimum_km, index) as number,
    });

    driver.validate();
    return driver;
  }
}
