import { AxiosHttpService, GoogleMapsService } from '../../shared/infra/services';

export const HTTP_SERVICE_PROVIDER = {
  provide: 'HttpService',
  useValue: new AxiosHttpService(),
};

export const MAPS_SERVICE_PROVIDER = {
  provide: 'MapsService',
  useFactory: (http: AxiosHttpService) => new GoogleMapsService(http),
  inject: [HTTP_SERVICE_PROVIDER.provide],
};
