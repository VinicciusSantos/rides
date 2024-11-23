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
  routeResponse: {
    distanceMeters: number;
    duration: string;
    polyline: {
      encodedPolyline: string;
    };
  };
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

export interface ConfirmRideRequest {
  customer_id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: {
    id: number;
    name: string;
  };
  value: number;
}

export interface ConfirmRideResponse {
  success?: boolean;
}

export const estimateRide = async (
  data: EstimateRideRequest
): Promise<EstimateRideResponse> =>
  fetcher("/ride/estimate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const confirmRide = async (
  data: ConfirmRideRequest
): Promise<ConfirmRideResponse> =>
  fetcher("/ride/confirm", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
