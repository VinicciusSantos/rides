import {
  HttpContentTypes,
  IHttpService,
} from '../../../../../shared/domain/services';
import { Config } from '../../../../../shared/infra/config';
import {
  AuthService,
  AuthUser,
  LoginRequest,
  LoginResponse,
} from '../../../domain/services';
import { KeycloakClient, SecretResponse } from './keycloak.types';

export class KeycloakService implements AuthService {
  private adminTokenExpiry: number | null = null;
  private _adminToken: string | null = null;
  private _clientSecret: string | null = null;
  private _clientId: string | null = null;

  private get clientId(): string {
    if (this._clientId) return this._clientId;
    throw new Error('Client id not set, try again later');
  }

  private get clientSecret(): string {
    if (this._clientSecret) return this._clientSecret;
    throw new Error('Client secret not set, try again later');
  }

  private get adminToken(): string {
    if (
      this._adminToken &&
      this.adminTokenExpiry &&
      Date.now() < this.adminTokenExpiry
    ) {
      return this._adminToken;
    }
    throw new Error('Admin token not set, try again later');
  }

  constructor(private readonly httpService: IHttpService) {
    this.loadBasicInfos();
  }

  public async login(params: LoginRequest): Promise<LoginResponse> {
    const { api_url, realm } = Config.env.keycloak;

    return this.httpService.post<LoginResponse>({
      url: `${api_url}/realms/${realm}/protocol/openid-connect/token`,
      headers: { 'Content-Type': HttpContentTypes.X_WWW_FORM_URLENCODED },
      data: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        username: params.emailOrUsername,
        password: params.password,
        grant_type: 'password',
      }),
    });
  }

  public async logout(refreshToken: string): Promise<void> {
    const { api_url, realm } = Config.env.keycloak;

    await this.httpService.post({
      url: `${api_url}/realms/${realm}/protocol/openid-connect/logout`,
      headers: { 'Content-Type': HttpContentTypes.X_WWW_FORM_URLENCODED },
      data: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
      }),
    });
  }

  public async register(user: AuthUser): Promise<void> {
    const adminToken = await this.loadAdminToken();

    const { api_url, realm } = Config.env.keycloak;

    await this.httpService.post({
      url: `${api_url}/admin/realms/${realm}/users`,
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': HttpContentTypes.JSON,
      },
      data: {
        username: user.username,
        email: user.email,
        enabled: true,
        credentials: [
          { type: 'password', value: user.password, temporary: false },
        ],
      },
    });
  }

  private async loadBasicInfos(): Promise<void> {
    const { api_url, realm } = Config.env.keycloak;

    await this.loadAdminToken();

    const clients = await this.httpService.get<KeycloakClient[]>({
      url: `${api_url}/admin/realms/${realm}/clients`,
      headers: { Authorization: `Bearer ${this.adminToken}` },
    });

    const ridesClient = clients.find((c) => c.clientId === 'rides-backend');
    if (!ridesClient) throw new Error(`Client 'rides-client' not found`);
    this._clientId = ridesClient.clientId;

    const secretResponse = await this.httpService.get<SecretResponse>({
      url: `${api_url}/admin/realms/${realm}/clients/${ridesClient.id}/client-secret`,
      headers: { Authorization: `Bearer ${this.adminToken}` },
    });
    this._clientSecret = secretResponse.value;
  }
  
  private async loadAdminToken(): Promise<void> {
    const { api_url, realm, admin_username, admin_password } =
    Config.env.keycloak;

    const response = await this.httpService.post<LoginResponse>({
      url: `${api_url}/realms/${realm}/protocol/openid-connect/token`,
      headers: { 'Content-Type': HttpContentTypes.X_WWW_FORM_URLENCODED },
      data: new URLSearchParams({
        client_id: 'admin-cli',
        username: admin_username,
        password: admin_password,
        grant_type: 'password',
      }),
    });

    this._adminToken = response.access_token;

    this.adminTokenExpiry = Date.now() + response.expires_in * 1000;
  }
}
