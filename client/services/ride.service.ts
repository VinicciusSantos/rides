export interface RideEstimateRequest {
  customer_id: string;
  origin: string;
  destination: string;
}

export interface RideEstimateResponse {
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

import { fetcher } from "@/lib/fetcher";

export async function getRideEstimate(
  data: RideEstimateRequest
): Promise<RideEstimateResponse> {
  return fetcher<RideEstimateResponse>("/ride/estimate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
