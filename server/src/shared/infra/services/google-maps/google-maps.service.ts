import {
  HttpContentTypes,
  IHttpService,
  IMapsService,
} from '../../../domain/services';
import { Geolocation } from '../../../domain/value-objects';
import { Config } from '../../config';
import {
  DirectionsRequest,
  DirectionsResult,
  DirectionsRoute,
  GeocoderRequest,
  GeocoderResponse,
  TravelMode,
} from './types';

export class GoogleMapsService implements IMapsService {
  constructor(private readonly http: IHttpService) {}

  public async getCoordinates(address: string): Promise<Geolocation> {
    const response = await this.http.post<GeocoderResponse>({
      url: 'https://maps.googleapis.com/maps/api/geocode/json',
      params: { address, key: Config.env.google_api_key } as GeocoderRequest,
    });

    const [result] = response.results;
    if (!result) {
      throw new Error(`No coordinates found for address: ${address}`);
    }

    const { lat, lng } = result.geometry.location;
    return new Geolocation(lat, lng, result.formatted_address);
  }

  public async computeRoutesByCar(
    origin: Geolocation,
    destination: Geolocation,
  ): Promise<DirectionsRoute> {
    const response = await this.http.post<DirectionsResult>({
      url: 'https://routes.googleapis.com/directions/v2:computeRoutes',
      headers: {
        'Content-Type': HttpContentTypes.JSON,
        'X-Goog-Api-Key': Config.env.google_api_key,
        'X-Goog-FieldMask':
          'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
      },
      data: {
        origin: {
          location: {
            latLng: {
              latitude: origin.latitude,
              longitude: origin.longitude,
            },
          },
        },
        destination: {
          location: {
            latLng: {
              latitude: destination.latitude,
              longitude: destination.longitude,
            },
          },
        },
        travelMode: TravelMode.DRIVE,
        computeAlternativeRoutes: false,
      } as DirectionsRequest,
    });

    if (!response.routes || !response.routes.length) {
      throw new Error('No route found');
    }

    return response.routes[0];
  }
}
