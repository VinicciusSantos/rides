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

export const signIn = async (
  data: SignInRequest
): Promise<SignInResponse> =>
  fetcher<SignInResponse>("/auth/login/credentials", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
