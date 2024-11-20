import { AxiosHttpService } from '../../shared/infra/services/axios-http';

export const HTTP_SERVICE_PROVIDER = {
  provide: 'HttpService',
  useValue: new AxiosHttpService(),
};
