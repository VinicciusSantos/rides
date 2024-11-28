import {
  LoginWithCredentialsUsecase,
  LogoutUsecase,
  RegisterUserUsecase,
} from '../../core/auth/application/usecases';
import { AuthService } from '../../core/auth/domain/services';
import { KeycloakService } from '../../core/auth/infra/services/keycloak/keycloak.service';
import { IHttpService } from '../../shared/domain/services';
import { HTTP_SERVICE_PROVIDER } from '../shared/shared.providers';

export const AUTH_SERVICE_PROVIDER = {
  provide: 'AuthService',
  useFactory: (httpService: IHttpService) => new KeycloakService(httpService),
  inject: [HTTP_SERVICE_PROVIDER.provide],
};

export const USE_CASES = {
  LOGIN_WITH_CREDENTIALS_USE_CASE: {
    provide: LoginWithCredentialsUsecase,
    useFactory: (authService: AuthService) =>
      new LoginWithCredentialsUsecase(authService),
    inject: [AUTH_SERVICE_PROVIDER.provide],
  },
  LOGOUT_USE_CASE: {
    provide: LogoutUsecase,
    useFactory: (authService: AuthService) => new LogoutUsecase(authService),
    inject: [AUTH_SERVICE_PROVIDER.provide],
  },
  REGISTER_USER_USE_CASE: {
    provide: RegisterUserUsecase,
    useFactory: (authService: AuthService) =>
      new RegisterUserUsecase(authService),
    inject: [AUTH_SERVICE_PROVIDER.provide],
  },
};
