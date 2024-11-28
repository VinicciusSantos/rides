import { ValueObject } from './value-object';

export interface GeolocationJSON {
  latitude: number;
  longitude: number;
  address: string | null;
}

export class Geolocation extends ValueObject {
  constructor(
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly address?: string,
  ) {
    super();
  }

  public toJSON(): GeolocationJSON {
    return {
      latitude: this.latitude,
      longitude: this.longitude,
      address: this.address ?? null,
    };
  }
}
