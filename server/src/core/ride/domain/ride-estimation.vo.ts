import { Geolocation, ValueObject } from '../../../shared/domain/value-objects';

export interface RideEstimationConstructorProps {
  id?: number;
  origin: Geolocation;
  destination: Geolocation;
  distance: number;
  duration: string;
  encoded_polyline: string;
  created_at?: Date;
}

export interface RideEstimationJSON {
  id: number;
  origin: Geolocation;
  destination: Geolocation;
  distance: number;
  duration: string;
  encoded_polyline: string;
  created_at: Date;
}

export class RideEstimation extends ValueObject {
  private readonly _id: number;
  private readonly _origin: Geolocation;
  private readonly _destination: Geolocation;
  private readonly _distance: number;
  private readonly _duration: string;
  private readonly _encoded_polyline: string;
  private readonly _created_at: Date;

  public get id(): number {
    return this._id;
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

  public get encoded_polyline(): string {
    return this._encoded_polyline;
  }

  public get created_at(): Date {
    return this._created_at;
  }

  constructor(props: RideEstimationConstructorProps) {
    super();
    this._id = props.id ?? -1;
    this._origin = props.origin;
    this._destination = props.destination;
    this._distance = props.distance;
    this._duration = props.duration;
    this._encoded_polyline = props.encoded_polyline;
    this._created_at = props.created_at ?? new Date();
  }

  public toJSON(): RideEstimationJSON {
    return {
      id: this._id,
      origin: this.origin,
      destination: this.destination,
      distance: this.distance,
      duration: this.duration,
      encoded_polyline: this.encoded_polyline,
      created_at: this.created_at,
    };
  }
}
