import { DirectionsRoute } from '../../infra/services/google-maps/types';
import { Geolocation } from '../value-objects';

export interface IMapsService {
  getCoordinates(address: string): Promise<Geolocation>;
  computeRoutesByCar(
    origin: Geolocation,
    destination: Geolocation,
  ): Promise<DirectionsRoute>;
}
