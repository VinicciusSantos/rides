export interface KeycloakTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  'not-before-policy': number;
  session_state: string;
  scope: string;
}

export interface KeycloakClient {
  id: string;
  clientId: string;
  name: string;
  description: string;
  rootUrl: string;
  adminUrl: string;
  baseUrl: string;
  surrogateAuthRequired: boolean;
  enabled: boolean;
  alwaysDisplayInConsole: boolean;
  clientAuthenticatorType: string;
  secret: string;
  redirectUris: string[];
  webOrigins: string[];
  notBefore: number;
  bearerOnly: boolean;
  consentRequired: boolean;
  standardFlowEnabled: boolean;
  implicitFlowEnabled: boolean;
  directAccessGrantsEnabled: boolean;
  serviceAccountsEnabled: boolean;
  authorizationServicesEnabled: boolean;
  publicClient: boolean;
  frontchannelLogout: boolean;
  protocol: string;
  attributes: {
    realm_client: string;
    'oidc.ciba.grant.enabled': string;
    'client.secret.creation.time': string;
    'backchannel.logout.session.required': string;
    'oauth2.device.authorization.grant.enabled': string;
    'backchannel.logout.revoke.offline.tokens': string;
  };
  authenticationFlowBindingOverrides: unknown;
  fullScopeAllowed: boolean;
  nodeReRegistrationTimeout: number;
  protocolMappers: unknown[];
  defaultClientScopes: string[];
  optionalClientScopes: string[];
  authorizationSettings: unknown;
}

export interface SecretResponse {
  type: string;
  value: string;
}
