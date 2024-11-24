import { toast } from "@/hooks/use-toast";

interface APIError {
  error_code: string;
  error_description: string;
}

export async function fetcher<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!API_BASE_URL) {
      throw new Error(
        "NEXT_PUBLIC_API_BASE_URL is not defined. Please check your .env configuration."
      );
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }
    
    return response.json();
  } catch (error: unknown) {
    toast({
      title: "Request Error",
      description:
        (error as APIError).error_description || "Something went wrong.",
      variant: "destructive",
      duration: 4000
    });

    throw error;
  }
}
