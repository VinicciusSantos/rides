import { fetcher } from "@/lib/fetcher";

export interface EstimateRideRequest {
  customer_id: string;
  origin: string;
  destination: string;
}

export interface EstimateRideResponse {
  origin: GeolocationJSON;
  destination: GeolocationJSON;
  distance: number;
  duration: string;
  options: EstimatedDriver[];
  routeResponse: unknown;
}

export interface GeolocationJSON {
  latitude: number;
  longitude: number;
  address: string | null;
}

export interface EstimatedDriver {
  id: number;
  name: string;
  description: string;
  vehicle: string;
  review: { rating: number; comment: string };
  value: number;
}

export const estimateRide = async (
  data: EstimateRideRequest
): Promise<EstimateRideResponse> =>
  fetcher("/ride/estimate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
