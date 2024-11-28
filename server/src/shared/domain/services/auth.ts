export interface AuthUser {
  username: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  'not-before-policy': number;
  session_state: string;
  scope: string;
}

export interface AuthService {
  login(params: LoginRequest): Promise<LoginResponse>;
  logout(refreshToken: string): Promise<void>;
  register(user: AuthUser): Promise<void>;
}
