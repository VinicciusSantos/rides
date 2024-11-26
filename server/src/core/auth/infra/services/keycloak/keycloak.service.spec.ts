// import {
//   HttpContentTypes,
//   IHttpService,
// } from '../../../../../shared/domain/services';
// import { Config } from '../../../../../shared/infra/config';
// import {
//   AuthUser,
//   LoginRequest,
//   LoginResponse,
// } from '../../../domain/services';
// import { KeycloakService } from './keycloak.service';

// const mockLoginRequest: LoginRequest = {
//   emailOrUsername: 'testuser',
//   password: 'testpassword',
// };

// const mockLoginResponse: LoginResponse = {
//   access_token: 'mock-access-token',
//   expires_in: 3600,
//   token_type: 'Bearer',
//   refresh_expires_in: 0,
//   refresh_token: '',
//   'not-before-policy': 0,
//   session_state: '',
//   scope: '',
// };

// const mockAuthUser: AuthUser = {
//   username: 'newuser',
//   email: 'newuser@example.com',
//   password: 'password123',
// };

// describe('KeycloakService', () => {
//   let keycloakService: KeycloakService;
//   let httpService: jest.Mocked<IHttpService>;

//   beforeEach(() => {
//     httpService = {
//       post: jest.fn(),
//     } as unknown as jest.Mocked<IHttpService>;

//     keycloakService = new KeycloakService(httpService);
//   });

//   it('should login successfully with valid credentials', async () => {
//     httpService.post.mockResolvedValue(mockLoginResponse);

//     const result = await keycloakService.login(mockLoginRequest);

//     expect(httpService.post).toHaveBeenCalledWith({
//       url: `${Config.env.keycloak.api_url}/realms/${Config.env.keycloak.realm}/protocol/openid-connect/token`,
//       headers: { 'Content-Type': HttpContentTypes.X_WWW_FORM_URLENCODED },
//       data: new URLSearchParams({
//         client_id: Config.env.keycloak.client_id,
//         client_secret: Config.env.keycloak.client_secret,
//         username: mockLoginRequest.emailOrUsername,
//         password: mockLoginRequest.password,
//         grant_type: 'password',
//       }),
//     });
//     expect(result).toEqual(mockLoginResponse);
//   });

//   it('should logout successfully with a valid refresh token', async () => {
//     httpService.post.mockResolvedValue(undefined);

//     await keycloakService.logout('mock-refresh-token');

//     expect(httpService.post).toHaveBeenCalledWith({
//       url: `${Config.env.keycloak.api_url}/realms/${Config.env.keycloak.realm}/protocol/openid-connect/logout`,
//       headers: { 'Content-Type': HttpContentTypes.X_WWW_FORM_URLENCODED },
//       data: new URLSearchParams({
//         client_id: Config.env.keycloak.client_id,
//         client_secret: Config.env.keycloak.client_secret,
//         refresh_token: 'mock-refresh-token',
//       }),
//     });
//   });

//   it('should register a new user successfully', async () => {
//     httpService.post
//       .mockResolvedValueOnce(mockLoginResponse) // Mock getAdminToken
//       .mockResolvedValueOnce(undefined); // Mock register

//     await keycloakService.register(mockAuthUser);

//     expect(httpService.post).toHaveBeenCalledWith({
//       url: `${Config.env.keycloak.api_url}/realms/${Config.env.keycloak.realm}/protocol/openid-connect/token`,
//       headers: { 'Content-Type': HttpContentTypes.X_WWW_FORM_URLENCODED },
//       data: new URLSearchParams({
//         client_id: 'admin-cli',
//         grant_type: 'client_credentials',
//         client_secret: Config.env.keycloak.admin_cli_secret,
//       }),
//     });

//     expect(httpService.post).toHaveBeenCalledWith({
//       url: `${Config.env.keycloak.api_url}/admin/realms/${Config.env.keycloak.realm}/users`,
//       headers: {
//         Authorization: `Bearer ${mockLoginResponse.access_token}`,
//         'Content-Type': HttpContentTypes.JSON,
//       },
//       data: {
//         username: mockAuthUser.username,
//         email: mockAuthUser.email,
//         enabled: true,
//         credentials: [
//           { type: 'password', value: mockAuthUser.password, temporary: false },
//         ],
//       },
//     });
//   });

//   it('should use cached admin token if not expired', async () => {
//     keycloakService['adminToken'] = 'cached-admin-token';
//     keycloakService['adminTokenExpiry'] = Date.now() + 3600 * 1000;

//     const adminToken = await keycloakService['getAdminToken']();

//     expect(adminToken).toBe('cached-admin-token');
//     expect(httpService.post).not.toHaveBeenCalled();
//   });

//   it('should fetch a new admin token if cached token is expired', async () => {
//     keycloakService['adminToken'] = 'expired-admin-token';
//     keycloakService['adminTokenExpiry'] = Date.now() - 1;

//     httpService.post.mockResolvedValue(mockLoginResponse);

//     const adminToken = await keycloakService['getAdminToken']();

//     expect(adminToken).toBe(mockLoginResponse.access_token);
//     expect(httpService.post).toHaveBeenCalledWith({
//       url: `${Config.env.keycloak.api_url}/realms/${Config.env.keycloak.realm}/protocol/openid-connect/token`,
//       headers: { 'Content-Type': HttpContentTypes.X_WWW_FORM_URLENCODED },
//       data: new URLSearchParams({
//         client_id: 'admin-cli',
//         grant_type: 'client_credentials',
//         client_secret: Config.env.keycloak.admin_cli_secret,
//       }),
//     });
//   });
// });
