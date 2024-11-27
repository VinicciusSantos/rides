import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { fetcher } from "@/lib/fetcher";

interface SignInRequest {
  email_or_username: string;
  password: string;
}

interface SignInResponse {
  access_token: string;
  expires_in: string;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  "not-before-policy": number;
  session_state: string;
  scope: string;
}

interface SignUpRequest {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
}

type SignUpResponse = SignInResponse;
export interface DecodedToken {
  exp: number;
  iat: number;
  jti: string;
  iss: string;
  aud: string;
  sub: string;
  typ: string;
  azp: string;
  sid: string;
  acr: string;
  "allowed-origins": string[];
  realm_access: {
    roles: string[];
  };
  resource_access: {
    account: { roles: string[] };
  };
  scope: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
}

export const signIn = async (data: SignInRequest): Promise<SignInResponse> =>
  fetcher<SignInResponse>("/auth/login/credentials", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const signUp = async (data: SignUpRequest): Promise<SignUpResponse> =>
  fetcher<SignUpResponse>("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const logout = async () => {
  return fetcher("/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      refresh_token: getRefreshToken(),
    }),
  });
};

export const setAccessToken = (token: string) => {
  Cookies.set("access_token", token, {
    httpOnly: false,
    sameSite: "strict",
    expires: 1 / 24,
  });
};

export const getAccessToken = () => {
  return Cookies.get("access_token");
};

export const removeAccessToken = () => {
  Cookies.remove("access_token");
};

export const getRefreshToken = () => {
  return Cookies.get("refresh_token");
};

export const setRefreshToken = (token: string) => {
  Cookies.set("refresh_token", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: 30 / 24,
  });
};

export const removeRefreshToken = () => {
  Cookies.remove("refresh_token");
};

export const getUser = () => {
  const token = getAccessToken();
  return token ? jwtDecode<DecodedToken>(token) : null;
};
