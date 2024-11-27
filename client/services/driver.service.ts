import { fetcher } from "@/lib/fetcher";

export interface Driver {
  driver_id: number;
  name: string;
  description: string;
  vehicle: Vehicle;
  review: Review;
  fee_by_km: number;
  minimum_km: number;
}

export interface Vehicle {
  model: string;
  brand: string;
  year: number;
  description: string;
  formatted_name: string;
}

export interface Review {
  rating: number;
  comment: string;
}

export interface DriverRequest {
  driver_id?: number;
  min_km_lte?: number;
}

export interface DriversResponse {
  items: Driver[];
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
}

export const fetchDrivers = async (
  data: DriverRequest = {}
): Promise<DriversResponse> => {
  const params = new URLSearchParams(data as Record<string, string>).toString();
  return fetcher<DriversResponse>(`/driver/all?${params}`, { method: "GET" });
};
