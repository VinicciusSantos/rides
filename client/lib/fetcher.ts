import { getAccessToken } from "@/services/auth.service";
import { env } from "next-runtime-env";

export async function fetcher<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const API_BASE_URL = env("NEXT_PUBLIC_API_BASE_URL");
    if (!API_BASE_URL) {
      throw new Error(
        "NEXT_PUBLIC_API_BASE_URL is not defined. Please check your .env configuration."
      );
    }

    const token = getAccessToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    if (options?.headers) {
      options.headers = { ...options.headers, ...headers };
    } else {
      options = { ...options, headers };
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    try {
      return await response.json();
    } catch {
      return response as unknown as T;
    }
  } catch (error: unknown) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
