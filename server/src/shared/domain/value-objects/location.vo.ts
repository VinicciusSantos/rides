import { ValueObject } from './value-object';

export interface GeolocationJSON {
  latitude: number;
  longitude: number;
}

export class Geolocation extends ValueObject {
  constructor(
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly address?: string
  ) {
    super();
  }

  public toJSON(): GeolocationJSON {
    return {
      latitude: this.latitude,
      longitude: this.longitude,
    };
  }
}
