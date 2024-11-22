const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    "API_BASE_URL is not defined. Please check your .env configuration."
  );
}

export async function fetcher<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorMessage}`);
  }

  return response.json();
}
